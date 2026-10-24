#!/usr/bin/env bash
# Filament/Laravel Number::format() needs the PHP intl extension.
# Run once with sudo on Manjaro/Arch:
set -euo pipefail
echo 'extension=intl' | sudo tee /etc/php/conf.d/intl.ini
php -r "echo extension_loaded('intl') ? \"CLI intl: OK\n\" : \"CLI intl: FAIL\n\";"
if systemctl is-active --quiet php-fpm 2>/dev/null; then
  sudo systemctl restart php-fpm
elif systemctl is-active --quiet httpd 2>/dev/null; then
  sudo systemctl restart httpd
fi
echo "Done. Reload /admin and check coder-applications."
