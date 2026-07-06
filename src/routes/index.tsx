import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import anasPng from "@/assets/Anas.png";
import arindamPng from "@/assets/Arindam.png";
import sakunaPng from "@/assets/Sakuna.png";
import tojiPng from "@/assets/toji.png";
import vikingPng from "@/assets/Viking.png";
import anthemAudio from "@/Audio/Future Leaders Anthem.mp3";

export const Route = createFileRoute("/")({
  component: Index,
});

const IMAGES = [
  {
    src: sakunaPng,
    bg: "#2C4A7C",
    panel: "#3D5F94",
    name: "Sakuna",
    subtitle: "Founder of the Future Leaders network and a well-known Web3 influencer",
  },
  {
    src: tojiPng,
    bg: "#B83232",
    panel: "#D14545",
    name: "Toji",
    subtitle: "Co-Founder of Future Leaders, community expansion and ecosystem development.",
  },
  {
    src: vikingPng,
    bg: "#E8B93C",
    panel: "#F0CC5C",
    name: "Viking",
    subtitle:
      "Co-Founder of Future Leaders, helping Web3 projects scale through strategic partnerships and community-led growth.",
  },
  {
    src: anasPng,
    bg: "#E86A3C",
    panel: "#F79B7F",
    name: "Anas",
    subtitle: "CM of Future Leaders, trading and creating educational content",
  },
  {
    src: arindamPng,
    bg: "#1E2740",
    panel: "#2E3A5C",
    name: "Arindam",
    subtitle: "Moderator of Future Leaders, Full Stack Web Developer",
  },
];

const GRAIN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>`,
)}`;

const EASE = "cubic-bezier(0.4,0,0.2,1)";
const DURATION = 650;

type Role = "center" | "left" | "right" | "back";

function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverDiscover, setHoverDiscover] = useState(false);
  const [hoverBtn, setHoverBtn] = useState<"prev" | "next" | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioInstance = new Audio(anthemAudio);
    audioInstance.loop = true;
    setAudio(audioInstance);

    const playAudio = () => {
      audioInstance
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          console.log("Playback blocked. Waiting for interaction.");
        });
    };

    playAudio();

    const handleInteraction = () => {
      if (audioInstance.paused) {
        playAudio();
      }
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      audioInstance.pause();
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  };

  useEffect(() => {
    IMAGES.forEach((i) => {
      const img = new Image();
      img.src = i.src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navigate = (dir: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      dir === "next" ? (prev + 1) % IMAGES.length : (prev + IMAGES.length - 1) % IMAGES.length,
    );
    setTimeout(() => setIsAnimating(false), DURATION);
  };

  const roleOf = (i: number): Role => {
    if (i === activeIndex) return "center";
    if (i === (activeIndex + IMAGES.length - 1) % IMAGES.length) return "left";
    if (i === (activeIndex + 1) % IMAGES.length) return "right";
    return "back";
  };

  const styleFor = (role: Role): CSSProperties => {
    const base: CSSProperties = {
      position: "absolute",
      aspectRatio: "0.6 / 1",
      transition: `transform ${DURATION}ms ${EASE}, filter ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}, left ${DURATION}ms ${EASE}, bottom ${DURATION}ms ${EASE}, height ${DURATION}ms ${EASE}`,
      willChange: "transform, filter, opacity",
    };
    switch (role) {
      case "center":
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "22%" : 0,
          height: isMobile ? "60%" : "92%",
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: 20,
        };
      case "left":
        return {
          ...base,
          left: isMobile ? "20%" : "30%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      case "right":
        return {
          ...base,
          left: isMobile ? "80%" : "70%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      case "back":
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "13%" : "22%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 5,
        };
    }
  };

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color ${DURATION}ms ${EASE}`,
        fontFamily: "'Metal Mania', sans-serif",
      }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative w-full" style={{ height: "100vh", overflow: "hidden" }}>
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            opacity: 0.4,
          }}
        />

        {/* Audio control button */}
        <motion.button
          onClick={togglePlay}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
          className="absolute top-6 right-6 z-[60] w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white bg-transparent hover:bg-white/10 transition-all duration-300 scale-90 hover:scale-100 cursor-pointer"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Volume2 size={22} className="animate-pulse" /> : <VolumeX size={22} />}
        </motion.button>

        {/* Giant ghost text */}
        <motion.h1
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: "18%",
            fontFamily: "'Metal Mania', sans-serif",
            fontSize: "clamp(40px, 13.5vw, 300px)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          Future Leaders
        </motion.h1>

        {/* Top-left brand */}
        {/* <div
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase"
          style={{ zIndex: 60, color: "white", opacity: 0.9, letterSpacing: "0.18em" }}
        >
          TOONHUB
        </div> */}

        {/* Carousel */}
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.3 }}
          className="absolute inset-0"
          style={{ zIndex: 3 }}
        >
          {IMAGES.map((item, i) => (
            <div key={i} style={styleFor(roleOf(i))}>
              <img
                src={item.src}
                alt=""
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Bottom-left text + nav */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.4 }}
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <h2
            className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase tracking-widest transition-opacity duration-300"
            style={{ color: "white", opacity: 0.95, letterSpacing: "0.02em" }}
          >
            {IMAGES[activeIndex].name}
          </h2>
          <p
            className="block text-[11px] sm:text-sm mb-3 sm:mb-5 transition-opacity duration-300"
            style={{ color: "white", opacity: 0.85, lineHeight: 1.6 }}
          >
            {IMAGES[activeIndex].subtitle}
          </p>
          <div className="flex gap-3">
            {(["prev", "next"] as const).map((dir) => {
              const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
              const hovered = hoverBtn === dir;
              return (
                <motion.button
                  key={dir}
                  onClick={() => navigate(dir)}
                  onMouseEnter={() => setHoverBtn(dir)}
                  onMouseLeave={() => setHoverBtn(null)}
                  whileHover={{
                    scale: 1.12,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.4)",
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  aria-label={dir === "prev" ? "Previous" : "Next"}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 border-white text-white bg-transparent cursor-pointer"
                >
                  <motion.div
                    animate={{
                      x: hovered ? (dir === "next" ? 4 : -4) : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <Icon size={26} strokeWidth={2.25} />
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom-right link */}
        <motion.a
          href="https://discord.gg/T8crg3yqe"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoverDiscover(true)}
          onMouseLeave={() => setHoverDiscover(false)}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: hoverDiscover ? 1 : 0.95 }}
          whileHover={{
            scale: 1.05,
            textShadow: "0px 0px 8px rgba(255, 255, 255, 0.6)",
          }}
          transition={{
            y: { type: "spring", stiffness: 100, damping: 18, delay: 0.5 },
            opacity: { duration: 0.2 },
            scale: { type: "spring", stiffness: 300, damping: 20 },
          }}
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center no-underline cursor-pointer"
          style={{
            zIndex: 60,
            fontFamily: "'Metal Mania', sans-serif",
            fontSize: "clamp(20px, 4vw, 56px)",
            fontWeight: 400,
            color: "white",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          DISCOVER IT
          <motion.div
            animate={{
              x: hoverDiscover ? 12 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="flex items-center"
          >
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 ml-2" strokeWidth={2.25} />
          </motion.div>
        </motion.a>
      </div>
    </div>
  );
}
