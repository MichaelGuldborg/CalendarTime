#!/bin/bash
production_branch='master'
staging_branch='staging'
current_branch=$(git rev-parse --abbrev-ref HEAD)
RED='\033[0;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print() {
    echo -e "$2$1${NC}"
}

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash and Yarn
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi