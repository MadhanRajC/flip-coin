    const coin = document.getElementById('coin');
    const flipBtn = document.getElementById('flipBtn');
    const result = document.getElementById('result');
    const rigHeads = document.getElementById('rigHeads');
    const rigTails = document.getElementById('rigTails');

    let isFlipping = false;

    // utility to perform a flip with random spins
    function performFlip(force) {
      if (isFlipping) return;
      isFlipping = true;

      // random spin count between 6 and 12 half-rotations
      const spins = Math.floor(Math.random() * 7) + 6; // 6..12
      // random small wobble
      const wobble = Math.floor(Math.random() * 30) - 15; // -15..14 deg

      // decide final side: 0 = heads, 1 = tails
      let side;
      if (force === 'H') side = 0;
      else if (force === 'T') side = 1;
      else side = Math.random() < 0.5 ? 0 : 1;

      // total degrees: each half-rotation (180deg) flips face
      const totalDeg = spins * 180 + (side === 1 ? 180 : 0) + wobble;

      // set transition duration proportional to spins
      const duration = Math.max(1.0, spins * 0.12) + 0.6; // seconds
      coin.style.transition = `transform ${duration}s cubic-bezier(.2,.8,.2,1)`;

      // start rotation around Y axis
      coin.style.transform = `rotateY(${totalDeg}deg)`;

      // announce result when transition ends
      const onEnd = () => {
        coin.removeEventListener('transitionend', onEnd);
        isFlipping = false;

        // set visible face properly by using mod 360
        const normalized = ((totalDeg % 360) + 360) % 360;
        const showingTails = normalized >= 90 && normalized < 270; // when flipped

        if (showingTails) {
          result.textContent = 'Tails';
        } else {
          result.textContent = 'Heads';
        }
      };

      coin.addEventListener('transitionend', onEnd);
    }

    // wire buttons and interactions
    flipBtn.addEventListener('click', () => performFlip());
    rigHeads.addEventListener('click', () => performFlip('H'));
    rigTails.addEventListener('click', () => performFlip('T'));

    coin.addEventListener('click', () => performFlip());
    coin.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        performFlip();
      }
    });

    // friendly: show initial state
    result.textContent = 'Ready — click to flip';