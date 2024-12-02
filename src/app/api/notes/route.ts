
import prisma from "@/lib/db/prisma";
import { createNoteSchema, delteNoteSchema, updateNoteSchema } from "@/lib/validation/notes";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = createNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error);
            return new Response(
                JSON.stringify({ error: "Invalid input" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { title, content } = parseResult.data;
        const { userId } = await auth();
        console.log("user id", userId);

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId
            }
        });



        console.log("Data being passed to Prisma:", { title, content, userId });


        return new Response(
            JSON.stringify({ note }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Prisma error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function PUT(req: Request){
    try{
        const body = await req.json();
        const parseResult = updateNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error);
            return new Response(
                JSON.stringify({ error: "Invalid input" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { id, title, content } = parseResult.data;
        const note = await prisma.note.findUnique({where: {id}});
        if(!note){
            return Response.json({error: "Note not found"}, {status: 404});
        }
        const { userId } = await auth();
        console.log("user id", userId);

        if (!userId || userId !== note.userId) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
        
    const updatedNote = await prisma.note.update({
        where: { id },
        data: {
          title,
          content,
        }
    })

        return  Response.json({updatedNote}, { status: 200});
    } catch (error){
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );

    }
}

export async function DELETE(req: Request){
    try{
        const body = await req.json();
        const parseResult = delteNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error);
            return new Response(
                JSON.stringify({ error: "Invalid input" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { id } = parseResult.data;
        const note = await prisma.note.findUnique({where: {id}});
        if(!note){
            return Response.json({error: "Note not found"}, {status: 404});
        }
        const { userId } = await auth();
        console.log("user id", userId);

        if (!userId || userId !== note.userId) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
        
        await prisma.note.delete({where:{id}})
      

        return  Response.json({message: "Note deleted"}, { status: 200});
    } catch (error){
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );

    }
}

