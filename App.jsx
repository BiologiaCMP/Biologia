import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Upload, Bot, ImageIcon } from "lucide-react";

export default function MemeAIApp() {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [image, setImage] = useState(null);
  const [generatedMeme, setGeneratedMeme] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const generateMeme = async () => {
    const res = await fetch("/api/generate-meme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topText, bottomText, image }),
    });
    const data = await res.json();
    setGeneratedMeme(data.memeUrl);
  };

  const sendMessage = async () => {
    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();
    setChatMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="meme">
          <TabsList className="mb-4">
            <TabsTrigger value="meme"><ImageIcon className="mr-2" />Generar Meme</TabsTrigger>
            <TabsTrigger value="chat"><Bot className="mr-2" />Chat con MemeAI</TabsTrigger>
          </TabsList>

          <TabsContent value="meme">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Input placeholder="Texto superior" value={topText} onChange={(e) => setTopText(e.target.value)} />
                <Input placeholder="Texto inferior" value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                <Button onClick={generateMeme}><Upload className="mr-2" />Generar Meme</Button>
                {generatedMeme && (
                  <div className="mt-4">
                    <img src={generatedMeme} alt="Meme generado" className="rounded-lg shadow" />
                    <Button className="mt-2" onClick={() => window.open(generatedMeme, "_blank")}> <Download className="mr-2" /> Descargar </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="h-64 overflow-y-auto bg-white p-2 rounded border">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`mb-2 text-sm ${msg.role === 'user' ? 'text-right' : 'text-left text-blue-600'}`}>{msg.content}</div>
                  ))}
                </div>
                <Textarea placeholder="Escribe tu mensaje..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                <Button onClick={sendMessage}><Bot className="mr-2" />Enviar</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
