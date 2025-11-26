import { NextResponse,NextRequest } from 'next/server';
import { monastries } from '@/data/monaastries';
// export async function GET(req : NextRequest, { params } : {params : {id :string}}) {
    
//   const id = Number(params.id);
//   console.log(id);
  
//   const monastery = monastries.find(m => m.id === id);

//   if (!monastery) {
//     return new NextResponse('Monastery not found', { status: 404 });
//   }
//   return NextResponse.json(monastery);
// }
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;  // await here!

  const id = Number(params.id);
  const monastery = monastries.find(m => m.id === id);

  if (!monastery) {
    return new NextResponse('Monastery not found', { status: 404 });
  }
  return NextResponse.json(monastery);
}