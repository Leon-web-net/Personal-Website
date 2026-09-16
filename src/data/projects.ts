import type { MiniProject, Project } from '../types'

/**
 * HOW TO ADD A PROJECT
 * 1. Append one object to `projects` below (order here = order on the page).
 * 2. Give it a preview. Easiest is an unlisted YouTube upload:
 *      media: { type: 'youtube', id: 'EW4Ia1L1KV4', alt: 'what happens in the video' }
 *    The id is the part after youtu.be/ or watch?v=. The page shows the video's
 *    thumbnail and only loads the player when someone clicks it.
 *    Alternatives: a self-hosted clip in /public/media
 *      media: { type: 'video', src: '/media/name.mp4', alt: '...' }
 *    or a still image (use fit: 'contain' for plots you must not crop)
 *      media: { type: 'image', src: '/media/plot.webp', alt: '...', fit: 'contain' }
 *    Leave `media` off entirely and a "coming soon" placeholder is shown.
 * 3. git push - Vercel redeploys.
 * The left/right alternation is automatic; you never set it here.
 */
export const projects: Project[] = [
  {
    id: 'gesture-app',
    title: 'Gesture App',
    tagline: 'Real-time hand gesture recognition',
    description:
      'Detects up to two hands from the webcam, classifies gestures per hand and overlays the 21-point landmark skeleton on the live feed. Inference runs client-side in WebAssembly via MediaPipe, so there is no server and nothing leaves the device. Includes an image upload mode and a reaction game that asks for a target gesture and checks a held, confidence thresholded match.',
    highlights: [
      'Runs offline — the model is bundled with the site, not loaded from an external server',
      'Built the gesture-detection logic as standalone code, with React only used to display the results',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'MediaPipe', 'WebAssembly', 'Canvas'],
    liveUrl: 'https://gesture-app-liart.vercel.app',
    codeUrl: 'https://github.com/Leon-web-net/gesture-app',
    status: 'live',
    period: '2026',
    media: {
      type: 'youtube',
      id: 'EW4Ia1L1KV4',
      alt: 'Screen recording of the gesture app tracking a hand and classifying gestures live',
    },
  },

   {
    id: 'torque-vectoring',
    title: 'Torque Vectoring for a Formula Student EV',
    tagline: 'Final year group project with Warwick Racing',
    description:
      'A two-layer closed loop controller that distributes torque between the wheels of an electric race car to improve cornering, built on Pacejka tyre modelling and load-transfer effects. Simulated in IPG CarMaker across different inhub motor drivetrain layouts. Four-person team; co-authored the 40-page group dissertation.',
    highlights: [
      'Targeted improved cornering stability and reduced trajectory error versus baseline (without torque vectoring)',
    ],
    tags: ['MATLAB', 'Simulink', 'IPG CarMaker', 'Vehicle Dynamics', 'Control design','Python','Arduino',],
    codeUrl: 'https://github.com/Leon-web-net/wrai_rc_ES410_GP15',
    status: 'complete',
    period: '2025 - 2026',
    media: { type: 'youtube',
       id: '-rH31oyapIE',
        alt: ' The design of a Torque Vectoring System'},
  },
  {
    id: 'quadrotor-mpc',
    title: 'Quadrotor Attitude Control',
    tagline: 'Linear and nonlinear MPC about an unstable hover equilibrium',
    description:
      'Attitude control of a quadrotor whose rotational inertias are on the order of 1e-4 kg·m², so the dynamics play out in milliseconds. Modelled and linearised the rotational dynamics, then designed a constrained linear MPC with a shared torque budget (‖τ‖₂ ≤ 0.25 N·m).',
    highlights: [
      'Spec: ±10° roll and pitch steps with under 1 s rise time and under 5% overshoot',
      'Rejected a [0.1, −0.1, 0.05] N·m impulse disturbance using feedback only.',
      'Held performance across 16 perturbed plants spanning ±55% inertia and ±75% damping uncertainty',
    ],
    tags: ['MATLAB', 'MPC', 'Nonlinear Control', 'Simulation'],
    codeUrl: 'https://github.com/Leon-web-net/Quadrotor-At titude',
    status: 'complete',
    period: '2026',
    media: { type: 'youtube',
       id: 'raWAx-1aEzQ',
        alt: ' Quadrotor attitude control simulation with linear and nonlinear MPC'
      },
  },
  {
    id: 'snake-ai',
    title: 'Snake AI',
    tagline: 'Deep Q-learning agent for the Warwick AI competition',
    description:
      'A DQN built in PyTorch with Double DQN, dueling head, prioritised replay, n-step returns, NoisyNet exploration and action masking. The board is encoded as a 15-channel spatial tensor with two stacked frames so a compact CNN can see motion, and reward shaping (food shaping, trap and starvation penalties) helps the model extract meaningful signal from what would otherwise be a sparse reward.',
    highlights: [
      'CI-verified average score of 26.3 across four difficulty tiers (1000 games each)',
  
    ],
    tags: ['Python', 'PyTorch', 'Reinforcement Learning', 'DQN', 'CNN'],
    codeUrl: 'https://github.com/Leon-web-net/Snake_AI',
    status: 'complete',
    period: '2025',
    media: { 
      type: 'youtube',
       id: 'tB5-RCj2B18',
        alt: 'Trained agent playing Snake' },
  },
 
  {
    id: 'neural-net-cpp',
    title: 'Neural Network from Scratch in C++',
    tagline: 'No ML libraries: custom matrix class, backprop and OpenMP-parallel training',
    description:
      'A second iteration of my from scratch feed forward network. The first version (Eigen-based) reached 97.4% on MNIST; this rewrite drops Eigen for custom matrix library, adds a proper CMake build and tests, and uses OpenMP to parallelise mini-batch training. The goal is a clean, dependency free implementation that I understand line by line.',
    highlights: ['v1 reached 97.4% accuracy on MNIST handwritten digits'],
    tags: ['C++20', 'CMake', 'OpenMP', 'Linear Algebra', 'MNIST'],
    codeUrl: 'https://github.com/Leon-web-net/NeuralNet-CPP-2',
    extraLink: { label: 'v1 (Eigen)', url: 'https://github.com/Leon-web-net/Neural-Network-cpp' },
    status: 'in-progress',
    period: '2026 - present',
  },
]

/** Smaller things worth a line each. Rendered as a compact list under the main projects. */
export const miniProjects: MiniProject[] = [
  {
    title: 'Object Detection for Autonomous Vehicles',
    description:
      'Fine-tuned and benchmarked three YOLOv10 sizes on nuImages for low-light and bad-weather scenes; rebalanced loss weights after per-class error analysis to reach 71.4% mAP@50.',
    tags: ['PyTorch', 'YOLOv10', 'Computer Vision'],
    codeUrl: 'https://github.com/Leon-web-net/Object-Detection-for-Autonomous-Vehicles',
  },
  {
    title: 'NeetCode Submissions',
    description: 'Ongoing algorithms and data-structures practice in Python.',
    tags: ['Python', 'Algorithms'],
    codeUrl: 'https://github.com/Leon-web-net/neetcode-submissions',
  },
]
