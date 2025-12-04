// import dbConnect from "@/lib/dbConnnect";
// import Monastery from "@/models/monasteriesModel"
// export async function GET() {
//   await dbConnect();
//   const monasteries = await Monastery.find();
//   console.log(monasteries);
//   return Response.json(monasteries);
// }
import dbConnect from "@/lib/dbConnnect";
import Monastery from "@/models/monasteriesModel";
export async function GET() {
  try {
    await dbConnect();
    const monasteries = await Monastery.find();
    console.log("Fetched monasteries:", monasteries);
    return Response.json(monasteries, { status: 200 });
  } catch (error) {
    console.error("Error fetching monasteries:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return Response.json(
      { message: "Failed to fetch monasteries", error: message },
      { status: 500 }
    );
  }
}
