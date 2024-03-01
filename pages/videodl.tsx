import Navigation from "@/components/Navigation";
import "@/app/globals.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function VideoDL() {
  const [url, setUrl] = useState("");

  console.log(url);
  const [videoInfo, setVideoInfo] = useState(
    {} as {
      title: string;
      lengthSeconds: any;
      thumbnail: string;
      videoWithAudio: string;
      bestAudioOnly: string;
    }
  );
  const bestVideoWithAudio = videoInfo.videoWithAudio as any;
  const [infoFetched, setInfoFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [length, setLength] = useState(0) as any;

  console.log(videoInfo.lengthSeconds);

  const getVideoInfo = async (url: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://52.67.83.187/video-info?url=${url}`);
      if (!response.ok) {
        throw new Error("Ocorreu um erro ao obter as informações do vídeo");
      }
      const data = await response.json();
      setVideoInfo(data);

      // Assuming videoInfo.lengthSeconds is a string representing the number of seconds
      const lengthSeconds = parseInt(data.lengthSeconds);

      // Check if lengthSeconds is a valid number
      if (!isNaN(lengthSeconds)) {
        // Calculate minutes and seconds
        const minutes = Math.floor(lengthSeconds / 60);
        const seconds = lengthSeconds % 60;

        // Format the result as "mm:ss"
        const length = `${minutes}m ${seconds}s`;
        setLength(length);
      } else {
        // Handle case where lengthSeconds is not a valid number
        console.error("Invalid lengthSeconds:", data.lengthSeconds);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setInfoFetched(true);
    }
  };

  // in work
  function downloadVideo() {
    const a = document.createElement("a");
    a.href = "http://52.67.83.187/downloadvideo?url=" + url;
    a.click();
  }

  function downloadOnlyAudio() {
    const a = document.createElement("a");
    a.href = "http://52.67.83.187/downloadaudio?url=" + url;
    a.click();
  }

  return (
    <main className="flex h-screen flex-col bg-black">
      <Navigation />
      <div className="flex flex-col h-full items-center w-full p-6 pt-24">
        <h1 className="text-white font-bold text-3xl">Baixar vídeos</h1>
        <div className="flex w-full items-center justify-center space-x-2 pt-6">
          <Input
            type="text"
            className="text-white border-neutral-600 w-1/5"
            placeholder="https://youtube.com/?watch..."
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              await getVideoInfo(url);
            }}
            type="submit"
          >
            Buscar vídeo
          </Button>
        </div>
        {infoFetched &&
          (error ? (
            <></>
          ) : (
            <iframe
              className="mt-12 w-full rounded-md"
              src={bestVideoWithAudio}
              title={videoInfo.title}
              allowFullScreen
              style={{ minHeight: "300px" }}
            ></iframe>
          ))}

        {infoFetched &&
          (error ? (
            <h1 className="text-red-600 mt-12">{error}</h1>
          ) : (
            <div className="flex-col flex items-center justify-center">
              <h1 className="text-white mt-6 font-bold">
                {videoInfo.title} <b className="text-blue-500">({length})</b>
              </h1>
              <div className="flex-row flex items-center justify-center gap-2">
                <Button
                  variant={"link"}
                  onClick={downloadOnlyAudio}
                  className="mt-6 text-white"
                >
                  Extrair áudio
                </Button>

                <Button
                  variant={"destructive"}
                  onClick={downloadVideo}
                  className="mt-6"
                >
                  Baixar Melhor vídeo
                </Button>
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="text-white flex items-center justify-center flex-col mt-24">
            <ReloadIcon className="h-6 w-6 animate-spin" />
            <p className="mt-6">Buscando informações</p>
          </div>
        )}
      </div>
    </main>
  );
}
