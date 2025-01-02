import { backendApp } from '@/backend/backend-app'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return backendApp.handleRequest(request)
}

export async function POST(request: NextRequest) {
  return backendApp.handleRequest(request)
}

export async function PUT(request: NextRequest) {
    return backendApp.handleRequest(request)
}

export async function PATCH(request: NextRequest) {
    return backendApp.handleRequest(request)
}

export async function DELETE(request: NextRequest) {
    return backendApp.handleRequest(request)
}