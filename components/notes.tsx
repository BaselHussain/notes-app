"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilePenIcon, TrashIcon } from "lucide-react";

type Note={
    id:number;
    title:string;
    content:string
}

const defaultNotes: Note[] = [
    {
      id: 1,
      title: "Grocery List",
      content: "Milk, Eggs, Bread, Apples",
    },
    {
      id: 2,
      title: "Meeting Notes",
      content: "Discuss new project timeline, assign tasks to team",
    },
    {
      id: 3,
      title: "Idea for App",
      content: "Develop a note-taking app with a clean and minimalist design",
    },
  ];

function useLocalStorage<T>(key:string,initialValue:T){
const[storedValue,setStoredValue]=useState<T>(initialValue)

useEffect(()=>{
    if(typeof window!=="undefined"){
        try {
            const item=window.localStorage.getItem(key)
if(item){
    setStoredValue(JSON.parse(item))
}
        } catch (error) {
            console.error(error)
        }
    }
},[key])


const setValue=(value:T | ((val:T)=>T))=>{
try {
    const valueToStore=
    value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }

} catch (error) {
    console.error(error)
}

}

return [storedValue, setValue] as const;

}


  export default function NotesAppComponent() {

const [notes,setNotes]=useLocalStorage<Note[]>("notes",defaultNotes)
const [newNote, setNewNote] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [edittingNoteID,setEdittingNoteID]=useState<number | null>(null)
  const [isMounted,setIsMounted]=useState<boolean>(false)


  useEffect(() => {
    setIsMounted(true);
  }, []);


const handleAddnote=()=>{
    if(newNote.title.trim() && newNote.content.trim()){
        const newNoteWithID={id:Date.now(),...newNote}
        setNotes([...notes,newNoteWithID])
        setNewNote({title:"",content:""})
    }
}


const handleEditNote=(id:number):void=>{
const noteToEdit=notes.find((note)=>note.id===id)
if(noteToEdit){
    setNewNote({title:noteToEdit.title,content:noteToEdit.content})
    setEdittingNoteID(id)
}
}

const handleUpdateNote=():void=>{
if(newNote.title.trim() && newNote.content.trim()){
    setNotes(
        notes.map((note)=>
        note.id===edittingNoteID?
        {id:note.id,title:newNote.title,content:newNote.content}:note)
    )
    setNewNote({ title: "", content: "" });
      setEdittingNoteID(null);
}
}

const handleDeleteNote=(id:number):void=>{
setNotes(notes.filter((note)=>note.id!==id))
}

if (!isMounted) {
    return null;
  }

    return(
        <>
<div className="h-screen flex flex-col ">
<header className="bg-muted p-4">
    <h1 className="text-2xl font-bold">Note Taker</h1>
</header>
<main className="flex-1 overflow-auto p-4">
<div className="">
    <input type="text" placeholder="title" value={newNote.title || ""}
     onChange={(e)=>setNewNote({...newNote,title:e.target.value})}
     className="w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"/>
<textarea name="" placeholder="content" rows={10}
value={newNote.content || ""}
onChange={(e)=>setNewNote({...newNote,content:e.target.value})}
className="mt-2 w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"></textarea>
{edittingNoteID===null?(
    <Button onClick={handleAddnote}>Add note</Button>
):(
    <Button onClick={handleUpdateNote}>Update note</Button>
)}
</div>
<div className="grid gap-4">
{notes.map((note)=>(
    <Card
    key={note.id}
    className="p-5">
        <div className="flex justify-between">
            <div>
                <h1 className="text-xl font-bold">{note.title}</h1>
                </div>
            <div>
                <Button onClick={() =>handleEditNote(note.id)} variant={'ghost'} size={'icon'}><FilePenIcon className="h-4 w-4" /></Button>
                <Button onClick={() =>handleDeleteNote(note.id)} variant={'ghost'} size={'icon'}><TrashIcon className="h-4 w-4" /></Button>
            </div>
        </div>
        <p className="mt-2 text-muted-foreground">{note.content}</p>
    </Card>
))}
</div>


</main>
</div>

        </>
    )
  }