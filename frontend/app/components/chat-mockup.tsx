import Image from "next/image";

export function ChatMockup() {
  return (
    <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
      <Image
        src="/chat_screen.png"
        alt="Leaf AI Interface Mockup"
        width={500}
        height={600}
        className="h-auto w-full object-contain rounded-2xl shadow-2xl border border-border"
        priority
      />
    </div>
  );
}

