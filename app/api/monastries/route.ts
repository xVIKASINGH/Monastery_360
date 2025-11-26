import { NextResponse } from 'next/server';
import { monastries } from '@/data/monaastries';

export async function GET() {
  // Just return summary or full data as needed
  return NextResponse.json(monastries);
}