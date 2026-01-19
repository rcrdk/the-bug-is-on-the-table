"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/BugGame.module.css";
import { randomInRange } from "../utils/randomInRange";
import { createBug } from "../utils/createBug";
import type { BugState } from "../types/BugState";

// Game configuration constants
const INITIAL_BUG_ID = 1;
const MAX_BUGS = 6;
const BUG_SPAWN_INTERVAL_MS = 1500;
const TABLE_ROWS = 32;
const TABLE_COLS = 14;

// Bug movement constants
const BUG_MOVE_X_MIN = 8;
const BUG_MOVE_X_MAX = 92;
const BUG_MOVE_Y_MIN = 8;
const BUG_MOVE_Y_MAX = 92;
const BUG_MOVE_ROTATION_MIN = -25;
const BUG_MOVE_ROTATION_MAX = 25;

// Animation timing constants
const HOP_ANIMATION_DURATION_MS = 600;
const SLAP_DELAY_MS = 500;
const MOUSE_MOVE_COOLDOWN_MS = 450;

// Bug movement delay constants
const DELAY_THRESHOLD_MOVES = 3;
const DELAY_PROBABILITY = 0.6;
const DELAY_BASE_MS = 350;
const DELAY_RANDOM_MIN_MS = 200;
const DELAY_RANDOM_MAX_MS = 400;

// Bottom pile position constants
const BOTTOM_Y_PERCENT = 97;

// Touch device auto-movement constants
const AUTO_MOVE_INTERVAL_MIN_MS = 500;
const AUTO_MOVE_INTERVAL_MAX_MS = 1200;
const AUTO_MOVE_PAUSE_MIN_MS = 200;
const AUTO_MOVE_PAUSE_MAX_MS = 600;

export function BugTable() {
  const [bugs, setBugs] = useState<BugState[]>([]);
  const [caughtAtLeastOne, setCaughtAtLeastOne] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringBug, setIsHoveringBug] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const bugMoveCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMoveTimeRef = useRef(0);
  const tableSurfaceRef = useRef<HTMLDivElement>(null);

  // Initialize on client side only to avoid hydration mismatch
  // This useEffect is necessary to prevent server/client HTML mismatch with random values
  useEffect(() => {
    if (bugs.length === 0) {
      setBugs([createBug(INITIAL_BUG_ID)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect touch / mobile devices to switch interaction mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & {
      maxTouchPoints?: number;
      msMaxTouchPoints?: number;
    };
    const hasTouch =
      "ontouchstart" in window ||
      (nav.maxTouchPoints ?? 0) > 0 ||
      (nav.msMaxTouchPoints ?? 0) > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  // Auto-move bugs on touch devices with random pauses
  useEffect(() => {
    if (!isTouchDevice) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextMove = () => {
      // Random pause before next move
      const pauseTime = randomInRange(
        AUTO_MOVE_PAUSE_MIN_MS,
        AUTO_MOVE_PAUSE_MAX_MS
      );

      timeoutId = setTimeout(() => {
        // Move bugs
        triggerBugMove();

        // Schedule next move after animation completes
        const nextMoveTime = randomInRange(
          AUTO_MOVE_INTERVAL_MIN_MS,
          AUTO_MOVE_INTERVAL_MAX_MS
        );

        timeoutId = setTimeout(() => {
          scheduleNextMove();
        }, nextMoveTime);
      }, pauseTime);
    };

    // Start the auto-movement cycle
    scheduleNextMove();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTouchDevice]);

  useEffect(() => {
    if (!caughtAtLeastOne) return;

    // After the first catch, start periodically adding more bugs.
    // If the user takes longer to swipe them away, more will accumulate.
    const interval = setInterval(() => {
      setBugs((prev) => {
        const alive = prev.filter((b) => !b.swipedAway);
        if (alive.length >= MAX_BUGS) return prev;

        const nextId = prev.reduce((m, b) => Math.max(m, b.id), 1) + 1;
        return [...prev, createBug(nextId)];
      });
    }, BUG_SPAWN_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [caughtAtLeastOne]);

  const triggerBugMove = () => {
    setBugs((prev) =>
      prev.map((bug) => {
        if (bug.caught || bug.swipedAway) return bug;
        return {
          ...bug,
          hopping: true,
          x: randomInRange(BUG_MOVE_X_MIN, BUG_MOVE_X_MAX),
          y: randomInRange(BUG_MOVE_Y_MIN, BUG_MOVE_Y_MAX),
          rotation: randomInRange(BUG_MOVE_ROTATION_MIN, BUG_MOVE_ROTATION_MAX),
        };
      })
    );

    // End hop state after transition
    setTimeout(() => {
      setBugs((prev) =>
        prev.map((bug) => ({
          ...bug,
          hopping: false,
        }))
      );
    }, HOP_ANIMATION_DURATION_MS);
  };

  const maybeMoveBugs = () => {
    const now = Date.now();
    // Add a small cooldown between moves so the bug doesn't teleport on every tiny mouse move
    if (now - lastMoveTimeRef.current < MOUSE_MOVE_COOLDOWN_MS) {
      return;
    }
    lastMoveTimeRef.current = now;

    bugMoveCountRef.current += 1;
    const moveNumber = bugMoveCountRef.current;

    // Sometimes delay the jump (not in the first three moves) so user can catch
    const shouldDelay =
      moveNumber > DELAY_THRESHOLD_MOVES && Math.random() < DELAY_PROBABILITY;

    if (shouldDelay) {
      setTimeout(() => {
        triggerBugMove();
      }, DELAY_BASE_MS + randomInRange(DELAY_RANDOM_MIN_MS, DELAY_RANDOM_MAX_MS));
    } else {
      triggerBugMove();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // On touch devices we don't use hover-based movement or the custom cursor
    if (!isTouchDevice) {
      if (tableSurfaceRef.current) {
        const rect = tableSurfaceRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      maybeMoveBugs();
    }
  };

  const handleBugEnter = (id: number) => {
    setIsHoveringBug(true);
    handleBugCatch(id);
  };

  const handleBugLeave = () => {
    setIsHoveringBug(false);
  };

  const handleBugCatch = (id: number) => {
    setBugs((prev) =>
      prev.map((bug) => {
        if (bug.id !== id || bug.hopping || bug.swipedAway) return bug;
        return { ...bug, caught: true };
      })
    );

    setCaughtAtLeastOne(true);

    // Start slap + drop-to-bottom animation shortly after catch
    setTimeout(() => {
      setBugs((prev) =>
        prev.map((bug) => {
          if (bug.id !== id || bug.swipedAway === true) return bug;
          return {
            ...bug,
            // Let the bug fall straight down to the bottom edge to create a pile
            // Give it a random rotation for a natural pile look
            x: bug.x,
            y: BOTTOM_Y_PERCENT,
            rotation: randomInRange(0, 360),
            swipedAway: true,
          };
        })
      );

      if (!audioRef.current) {
        const audio = new Audio("/slap.mp3");
        audioRef.current = audio;
      }

      audioRef.current
        ?.play()
        .catch(() => {
          // ignore autoplay issues
        });
    }, SLAP_DELAY_MS);
  };

  return (
    <div className={styles.gameRoot}>
      <div
        ref={tableSurfaceRef}
        className={styles.tableSurface}
        onMouseMove={handleMouseMove}
      >
        <table className={styles.tableGrid}>
          <tbody>
            {Array.from({ length: TABLE_ROWS }).map((_, row) => (
              <tr key={row}>
                {Array.from({ length: TABLE_COLS }).map((_, col) => (
                  <td key={col} className={styles.tableCell} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {bugs.map((bug) => {
          const isInactive = bug.swipedAway;
          const eventHandlers = isTouchDevice
            ? {
                onClick: isInactive ? undefined : () => handleBugEnter(bug.id),
              }
            : {
                onMouseEnter: isInactive
                  ? undefined
                  : () => handleBugEnter(bug.id),
                onMouseLeave: isInactive ? undefined : handleBugLeave,
              };

          return (
            <div
              key={bug.id}
              className={[
                styles.bug,
                bug.hopping ? styles.bugHopping : "",
                bug.caught ? styles.bugCaught : "",
                bug.swipedAway ? styles.bugSwiped : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${bug.x}%`,
                top: `${bug.y}%`,
                transform: `translate(-50%, -50%) rotate(${bug.rotation}deg)`,
              }}
              {...eventHandlers}
            >
              <span className={styles.bugEmoji}>{bug.emoji}</span>
            </div>
          );
        })}

        {!isTouchDevice && (
          <div
            className={styles.cursorHand}
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            }}
          >
            {isHoveringBug ? "👊" : "✋"}
          </div>
        )}
      </div>
    </div>
  );
}

