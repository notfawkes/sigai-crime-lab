"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e7e7e7]">
      {/* LOGO */}
      <div className="absolute left-8 bottom-16 z-20">
        <Image
          src="/SIGAI-logo.png"
          alt="SIGAI Logo"
          width={140}
          height={140}
          priority
        />
      </div>

      {/* CRIME LAB TEXT */}
      <h1
        className="
          absolute
          top-4
          left-1/2
          -translate-x-1/2
          text-[#d01f5b]
          uppercase
          leading-none
          z-0
          whitespace-nowrap
        "
        style={{
          fontFamily: "var(--font-league-gothic)",
          fontSize: "clamp(8rem, 28vw, 30rem)",
        }}
      >
        CRIME LAB
      </h1>

      {/* HERO IMAGE */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2
          z-10
        "
      >
        <Image
          src="/hero-img.webp"
          alt="Detective"
          width={650}
          height={850}
          priority
          className="object-contain"
        />

        {/* PLAY & LOGIN CONTROLS */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <button
            onClick={() => router.push("/signup")}
            className="
              px-10
              py-4
              rounded-full
              bg-[#d01f5b]
              text-white
              font-bold
              text-2xl
              tracking-wide
              transition-all
              hover:scale-105
              shadow-xl
              cursor-pointer
            "
            style={{
              fontFamily: "var(--font-montserrat)",
            }}
          >
            PLAY NOW
          </button>
          <button
            onClick={() => router.push("/login")}
            className="
              text-[#d01f5b]
              hover:text-black
              font-bold
              text-sm
              tracking-widest
              transition-all
              uppercase
              cursor-pointer
              mt-1
            "
            style={{
              fontFamily: "var(--font-montserrat)",
            }}
          >
            RETURNING INVESTIGATOR? LOG IN
          </button>
        </div>
      </div>

      {/* DATE & VENUE */}
      <div
        className="
          absolute
          right-24
          bottom-16
          text-black
          font-bold
          space-y-0
          z-20
        "
        style={{
          fontFamily: "var(--font-montserrat)",
        }}
      >
        <div className="text-[clamp(2rem,2vw,4rem)]">
          • DATE: 17 JUN 26
        </div>
        <div className="text-[clamp(2rem,2vw,4rem)]">
          • VENUE: 307/308
        </div>
      </div>
    </main>
  );
}
