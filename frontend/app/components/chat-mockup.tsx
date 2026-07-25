import Image from "next/image";

export function ChatMockup() {
  return (
    <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
      <Image
        src="/image-Photoroom.png"
        alt="Leaf AI Interface Mockup"
        width={500}
        height={600}
        className="h-auto w-full object-contain drop-shadow-2xl"
        priority
      />
    </div>
  );
}
