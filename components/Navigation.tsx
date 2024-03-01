import { BoxModelIcon } from "@radix-ui/react-icons";

export default function Navigation() {
  function handleGO(path: string) {
    return () => {
      window.location.href = `/${path}`;
    };
  }
  return (
    <ul className="flex flex-row gap-6 border-neutral-900 border-b p-4 bg-black">
      <li className="flex flex-row items-center gap-2">
        <BoxModelIcon width={24} height={24} color="white" />
        <h1 className="font-bold text-white">l1ma/utilities</h1>
      </li>
      <li className="flex flex-row items-center gap-2">
        <button
          onClick={handleGO("")}
          className="text-neutral-400 font-medium hover:text-neutral-300 transition-all text-sm "
        >
          Início
        </button>
      </li>
      <li className="flex flex-row items-center gap-2">
        <button
          onClick={handleGO("videodl")}
          className="text-neutral-400 font-medium hover:text-neutral-300 transition-all text-sm"
        >
          Video-DL
        </button>
      </li>
    </ul>
  );
}
