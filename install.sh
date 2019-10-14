#!/bin/bash    

# If no args provided, default to npm
if [ $# -eq 0 ]; then
    PKG_MGR="npm"
else
    PKG_MGR="yarn"
fi

# Check if pkg_manager is installed
if $PKG_MGR -version &> /dev/null; then
    echo "Using $PKG_MGR v`$PKG_MGR -v`"
else
    echo "$PKG_MGR is not installed"
    exit
fi

# install truffle globally
echo "Installing truffle using $PKG_MGR"
if [ $PKG_MGR == "npm" ]; then
    $PKG_MGR install -g truffle
else
    $PKG_MGR global add truffle
fi

echo "Installing dependencies"
$PKG_MGR install

echo "Installing frontend dependencies"
cd ./frontend
$PKG_MGR install

