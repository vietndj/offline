with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

imports = """import os
import time
import sqlite3
import argparse
from datetime import datetime
import subprocess
import requests
import re
import sys
"""
# Replace the weird top section with correct imports
content = imports + content[content.find('sys.path.append'):]
with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
    f.write(content)
