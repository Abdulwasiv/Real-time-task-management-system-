FROM golang:1.21

WORKDIR /usr/src/app

# Copy go.mod files first for layer caching
COPY go.mod go.sum ./

# Copy source files
COPY . .

