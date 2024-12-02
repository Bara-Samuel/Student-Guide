import { Metadata } from "next";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";

export const metadata: Metadata = {
  title: "StudentGuide - notes",
};
export default async function Notespage() {
  const { userId } = await auth();

  if(!userId) throw Error("userId undefined");

  console.log("id is");
  console.log(userId);

  const allNotes = await prisma.note.findMany({where: {userId}})

  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {(allNotes).map((note) => (
      <Note note={note} key={note.id}/>
    ))

    }
    {(await allNotes).length === 0 && (
      <div className="col-span-full text-center">
        {"You don't have any notes yet. Why not create one?"}
      </div>
    )}
  </div>;
}
