import { spawn } from 'node:child_process';

function runProcess(label, cmd, args, cwd) {
  const child = spawn(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env }
  });
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
    }
  });
  return child;
}

const backend = runProcess('backend', 'npm', ['run', 'start'], 'backend');
const frontend = runProcess('frontend', 'npm', ['run', 'dev'], 'frontend');

function shutdown() {
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
