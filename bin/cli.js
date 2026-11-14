#!/usr/bin/env node

const readline = require('readline');
const https = require('https');
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const SERVER_NAME = 'citecontext-mcp';
const SERVER_VERSION = '1.0.0';
const PROTOCOL_VERSION = '2024-11-05';
const DEFAULT_API_URL = process.env.CITECONTEXT_API_URL || 'https://citecontext.com/api/mcp/run';

const localServerPy = path.join(__dirname, '..', 'core', 'mcp_server.py');
const hasLocalServer = fs.existsSync(localServerPy);
const useLocalPython = (process.env.CITECONTEXT_LOCAL === '1' || hasLocalServer) && !process.env.CITECONTEXT_REMOTE;

function log(msg) {
  process.stderr.write(`[citecontext-mcp] ${msg}\n`);
}

if (useLocalPython) {
  log(`Starting local Python MCP server (${localServerPy})...`);
  const pythonBin = process.env.PYTHON || 'python3';
  const child = spawn(pythonBin, ['-m', 'core.mcp_server'], {
    cwd: path.join(__dirname, '..'),
    stdio: ['inherit', 'inherit', 'inherit'],
    env: process.env,
  });

  child.on('error', (err) => {
    log(`Failed to spawn Python process: ${err.message}. Falling back to hosted API gateway...`);
    startRemoteBridge();
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  startRemoteBridge();
}

function startRemoteBridge() {
  log(`Connected to CiteContext MCP gateway (${DEFAULT_API_URL})`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let req;
    try {
      req = jsonParse(trimmed);
    } catch (e) {
      send({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' },
      });
      return;
    }

    handleMessage(req);
  });
}

function jsonParse(str) {
  return JSON.parse(str);
}

function send(obj) {
  if (!obj) return;
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function handleMessage(req) {
  const method = req.method;
  const id = req.id;

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      },
    });
    return;
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'ping') {
    send({ jsonrpc: '2.0', id, result: {} });
    return;
  }

  // Forward tools/list and tools/call to CiteContext API
  forwardToApi(req);
}

function forwardToApi(req) {
  try {
    const payload = JSON.stringify(req);
    const u = new URL(DEFAULT_API_URL);
    const client = u.protocol === 'https:' ? https : http;

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'User-Agent': `CiteContext-MCP-Node/${SERVER_VERSION}`,
    };

    if (process.env.CITECONTEXT_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.CITECONTEXT_API_KEY}`;
      headers['X-API-Key'] = process.env.CITECONTEXT_API_KEY;
    }

    const request = client.request(
      u,
      {
        method: 'POST',
        headers,
        timeout: 25000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const respJson = JSON.parse(body);
            send(respJson);
          } catch (err) {
            send({
              jsonrpc: '2.0',
              id: req.id,
              error: { code: -32603, message: `Gateway error: ${body || res.statusCode}` },
            });
          }
        });
      }
    );

    request.on('error', (err) => {
      send({
        jsonrpc: '2.0',
        id: req.id,
        error: { code: -32000, message: `Network error connecting to CiteContext: ${err.message}` },
      });
    });

    request.write(payload);
    request.end();
  } catch (err) {
    send({
      jsonrpc: '2.0',
      id: req.id,
      error: { code: -32603, message: err.message },
    });
  }
}
