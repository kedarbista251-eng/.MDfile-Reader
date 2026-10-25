import type { SampleDoc } from '../types';

export const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: 'welcome',
    title: 'Welcome to LightMD Reader',
    description: 'Feature showcase with Math formulas, Mermaid diagrams, code syntax highlighting, and alerts',
    markdown: `# Welcome to LightMD 🚀

> **LightMD** is an ultra-fast, lightweight, and gorgeous Markdown reader designed for seamless reading on the web and as a browser extension.

---

## ✨ Key Features at a Glance

- ⚡ **Instant Rendering**: Powered by lightweight streaming parser with 0 latency.
- 📐 **Math Formulas (KaTeX)**: Beautiful inline & block LaTeX rendering.
- 📊 **Interactive Diagrams (Mermaid)**: Real-time vector flowchart & sequence diagrams.
- 💻 **Syntax Highlighting**: Beautiful theme-matched code blocks with 1-click copy.
- 📑 **Smart Table of Contents**: Auto-generated TOC with real-time scroll spy.
- 🎨 **Reading Modes**: OLED Dark, Warm Sepia, Dracula Slate, and Paper Light.
- 📤 **Export Suite**: 1-click clean PDF print, standalone HTML, and raw copy.

---

## 🧮 Mathematical Expressions (KaTeX)

LightMD natively renders LaTeX mathematical equations with sub-millisecond performance.

### Einstein's Mass-Energy Equivalence
The famous relationship is given by:
$$E = m c^2$$

### Gaussian Integral
An elegant closed-form formula in calculus:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

### Euler's Identity & Matrix Equation
Here is inline math: $e^{i\\pi} + 1 = 0$, and a matrix representation:

$$
\\begin{pmatrix}
\\cos\\theta & -\\sin\\theta \\\\
\\sin\\theta & \\cos\\theta
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
x' \\\\
y'
\\end{pmatrix}
$$

---

## 📊 Mermaid Diagrams

Render dynamic vector diagrams straight from pure text markdown fences.

\`\`\`mermaid
graph TD
    A[📄 Raw .md File or URL] --> B[⚡ LightMD Parser]
    B --> C{Detect Content}
    C -->|Math Notation| D[📐 KaTeX Engine]
    C -->|Diagram Code| E[📊 Mermaid Vector SVG]
    C -->|Source Code| F[🎨 Syntax Highlighter]
    C -->|Headings| G[📑 Auto-generated TOC]
    D --> H[📖 Distraction-Free Reader]
    E --> H
    F --> H
    G --> H
\`\`\`

---

## 💻 Code Highlighting with 1-Click Copy

Test our high-performance syntax highlighter across modern languages:

### TypeScript / React
\`\`\`typescript
interface ReaderConfig {
  theme: 'dark' | 'light' | 'sepia' | 'dracula';
  fontSize: number;
  enableToc: boolean;
}

export function initializeReader(config: ReaderConfig): void {
  console.log(\`[LightMD] Initializing reader in \${config.theme} mode\`);
  document.documentElement.setAttribute('data-theme', config.theme);
}
\`\`\`

### Python Data Processing
\`\`\`python
import math

def calculate_reading_speed(word_count: int, wpm: int = 200) -> float:
    """Computes estimated reading time in minutes."""
    minutes = word_count / wpm
    return math.ceil(minutes)

print(f"Estimated reading time: {calculate_reading_speed(1450)} mins")
\`\`\`

---

## 📣 GitHub-Style Callout Alerts

> [!NOTE]
> LightMD processes everything entirely on the client side. No server uploads, no tracking, complete privacy.

> [!TIP]
> You can drag and drop any \`.md\` or \`.markdown\` file from your desktop directly into this window at any time!

> [!IMPORTANT]
> To use LightMD as an extension in Chrome or Edge, load the build folder via \`chrome://extensions\` in Developer Mode.

> [!WARNING]
> Reading without dark mode at 2 AM may cause eye strain! Switch to OLED Dark or Sepia using the top menu.

---

## 📋 Interactive Task Lists & Tables

Check off items as you explore LightMD features:

- [x] Scaffolding high-performance Vite React TypeScript architecture
- [x] Implementing KaTeX LaTeX rendering
- [x] Adding Mermaid vector diagram engine
- [x] Adding 1-click Code block Copy
- [x] Providing auto-generated Table of Contents & Scroll-spy
- [ ] Install Chrome Extension to your browser bar

### Performance Comparison Table

| Metric | Traditional Web Readers | LightMD Reader |
| :--- | :--- | :--- |
| **Initial Bundle Size** | ~12 MB - 25 MB | **< 350 KB** |
| **Parsing Latency** | 120ms - 350ms | **< 4ms (Instant)** |
| **Mermaid & KaTeX** | Requires heavy plugins | **Built-in Zero-Config** |
| **Browser Extension** | Clunky or paid | **100% Free & Open** |
| **Privacy** | Often phones home | **100% Local Client-Side** |

---

## 💡 Ready to Read Your Own Files?

Click **Open File** in the top navigation bar, paste markdown directly, or drag and drop any file anywhere on this screen!
`
  },
  {
    id: 'cheatsheet',
    title: 'Markdown Reference & Cheatsheet',
    description: 'Comprehensive formatting cheat sheet covering headings, lists, tables, blockquotes, and code styles',
    markdown: `# Markdown Quick Reference Guide

A handy guide for standard Markdown and GitHub Flavored Markdown (GFM).

---

## Text Formatting

- **Bold text**: \`**bold**\` or \`__bold__\`
- *Italic text*: \`*italic*\` or \`_italic_\`
- ***Bold and Italic***: \`***bold & italic***\`
- ~~Strikethrough~~: \`~~strikethrough~~\`
- \`Inline code\`: \`\\\`code\\\`\`
- Highlighted text or links: [Visit GitHub](https://github.com)

---

## Headings Hierarchy

# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

---

## Blockquotes & Nested Quotes

> "Simplicity is the soul of efficiency."
> — Austin Freeman

> Single level quote
>> Nested blockquote level two
>>> Deeply nested quote level three

---

## Unordered & Ordered Lists

### Grocery List
* Honeycrisp apples
* Arabica coffee beans
* Oat milk
  * Organic unsweetened
  * Barista edition

### Step by Step Guide
1. Download or clone the repository
2. Run \`npm install\`
3. Run \`npm run dev\`
4. Open your browser at \`http://localhost:5173\`

---

## Code Blocks

\`\`\`bash
# Install dependencies
npm install

# Start local development server
npm run dev
\`\`\`
`
  },
  {
    id: 'architecture',
    title: 'Technical Design Specification',
    description: 'Sample real-world technical architecture documentation with sequence diagrams and schema',
    markdown: `# System Architecture Spec: LightMD V1

**Status:** Approved  
**Author:** Core Engineering Team  
**Date:** 2026-10-10  

---

## 1. Executive Summary

LightMD is designed around a zero-server-overhead, client-side first architecture. It serves dual operational targets:
1. **PWA / Web Application**: Hosted as a static bundle on CDN edges.
2. **Chromium Extension (MV3)**: Bundled with lightweight manifest for offline local file inspection.

---

## 2. Sequence Diagram: File Loading & Render Pipeline

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as LightMD Interface
    participant Worker as Parser Engine
    participant Katex as KaTeX & Mermaid
    participant DOM as Rendered View

    User->>UI: Drops .md file or loads URL
    UI->>Worker: Dispatch raw markdown string
    Worker->>Worker: Parse GFM AST & extract Headings
    Worker->>Katex: Render LaTeX formulas & Diagrams
    Worker-->>UI: Return sanitized HTML + TOC Tree
    UI->>DOM: Mount with Theme & Font Styles
    DOM-->>User: Display interactive document in < 10ms
\`\`\`

---

## 3. Data Schema & Persistence

Document preferences and cached files are retained safely in browser \`localStorage\` or Chrome Extension \`chrome.storage.local\`:

\`\`\`json
{
  "theme": "dark",
  "fontFamily": "sans",
  "fontSize": 17,
  "readingWidth": "standard",
  "lineHeight": "comfortable",
  "recentDocuments": [
    {
      "id": "doc_99182",
      "title": "Welcome to LightMD",
      "lastModified": 1791629800000
    }
  ]
}
\`\`\`

---

## 4. Key Performance Indicators (KPIs)

- **First Contentful Paint (FCP)**: < 250ms
- **Interaction to Next Paint (INP)**: < 16ms (60 FPS scrolling)
- **Time to Interactive (TTI)**: < 400ms
- **Memory Footprint**: < 22MB active heap
`
  }
];

export interface StudentSubjectSet {
  id: string;
  subjectName: string;
  description: string;
  chapters: {
    id: string;
    chapterNumber: number;
    title: string;
    markdown: string;
  }[];
}

export const STUDENT_SUBJECT_SETS: StudentSubjectSet[] = [
  {
    id: 'computer-networks',
    subjectName: 'Computer Networks (CS 340)',
    description: '3 comprehensive chapters with OSI diagrams, protocol flowcharts, and comparison tables',
    chapters: [
      {
        id: 'cn-ch1',
        chapterNumber: 1,
        title: 'Chapter 1: OSI 7-Layer Model & Physical Foundations',
        markdown: `# Chapter 1: OSI 7-Layer Model & Network Foundations 🌐
*Course: CS 340 - Computer Networks*
*Author: Student Lecture Notes (Week 1-2)*

---

## 🎯 Learning Objectives
- Master the 7-Layer OSI Reference Architecture
- Understand data encapsulation from Application down to Physical layer
- Compare OSI reference model with modern 4-Layer TCP/IP stack

---

## 🏗️ The 7-Layer OSI Architecture

The Open Systems Interconnection (OSI) model decomposes communication into 7 distinct abstraction boundaries:

\`\`\`mermaid
graph TD
    subgraph Upper Layers [Software / User Facing]
        L7[Layer 7: Application - HTTP, DNS, SSH]
        L6[Layer 6: Presentation - SSL/TLS, ASCII, JPEG]
        L5[Layer 5: Session - RPC, NetBIOS, Sockets]
    end
    subgraph Transport & Routing [Operating System & Kernels]
        L4[Layer 4: Transport - TCP Segments, UDP Datagrams]
        L3[Layer 3: Network - IP Packets, Routers, ICMP]
    end
    subgraph Hardware & Media [Physical Delivery]
        L2[Layer 2: Data Link - Ethernet Frames, MAC, Switches]
        L1[Layer 1: Physical - Bits, Cables, Radio Frequencies]
    end
    L7 --> L6 --> L5 --> L4 --> L3 --> L2 --> L1
\`\`\`

---

## 📦 Data Encapsulation & Protocol Data Units (PDUs)

As data moves down the protocol stack, each layer prefixes its specific header (and sometimes a trailer):

| OSI Layer | Protocol Data Unit (PDU) | Key Header Fields | Primary Device |
| :--- | :--- | :--- | :--- |
| **Layer 7-5** | **Data / Payload** | Application metadata, auth tokens | Host / Client |
| **Layer 4** | **Segment (TCP) / Datagram (UDP)** | Source Port, Destination Port, Seq/Ack | OS Kernel / Firewall |
| **Layer 3** | **Packet** | Source IP, Dest IP, TTL, Protocol ID | Router, Layer-3 Switch |
| **Layer 2** | **Frame** | Source MAC, Dest MAC, VLAN, CRC FCS | Switch, Network Interface Card (NIC) |
| **Layer 1** | **Bits** | Preamble, Voltage pulses, Photons | Repeater, Hub, Optical Fiber |

---

## 💡 Bandwidth vs. Latency Formulas

Transmission delay for sending a packet of size $L$ bits over a link of bandwidth $R$ bps:

$$d_{\\text{trans}} = \\frac{L}{R}$$

Propagation delay over physical distance $d$ at propagation speed $s \\approx 2 \\times 10^8 \\text{ m/s}$:

$$d_{\\text{prop}} = \\frac{d}{s}$$

Total one-way packet delay:
$$D_{\\text{total}} = d_{\\text{proc}} + d_{\\text{queue}} + d_{\\text{trans}} + d_{\\text{prop}}$$

> [!TIP]
> **Study Tip**: Compare this chapter with **Chapter 2 (Transport Layer)** to understand how TCP handles retransmission when packets are dropped at Layer 3!
`,
      },
      {
        id: 'cn-ch2',
        chapterNumber: 2,
        title: 'Chapter 2: Transport Layer: TCP vs UDP Deep Dive',
        markdown: `# Chapter 2: Transport Protocols: TCP vs. UDP Deep Dive ⚡
*Course: CS 340 - Computer Networks*
*Author: Student Lecture Notes (Week 3-4)*

---

## 🎯 Learning Objectives
- Compare connection-oriented (TCP) and connectionless (UDP) transport
- Trace TCP Three-Way Handshake & Four-Way Teardown
- Analyze Sliding Window flow control and AIMD congestion control

---

## 🔄 Protocol Comparison Matrix

When studying transport architectures, compare the guarantees provided by TCP and UDP:

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection State** | Connection-oriented (handshake required) | Connectionless (fire-and-forget) |
| **Reliability** | 100% Guaranteed delivery (ACKs & Retransmission) | Best-effort (packets may drop or arrive out-of-order) |
| **Ordering** | In-order byte stream guaranteed | No ordering guarantees |
| **Overhead** | 20-60 byte header | Lightweight 8-byte header |
| **Flow & Congestion Control**| Sliding window + AIMD congestion control | None (application must implement) |
| **Typical Use Cases** | Web (HTTP/HTTPS), Email (SMTP), File transfer | Gaming, Video streaming, DNS, VoIP |

---

## 🤝 TCP Three-Way Handshake Sequence

Before any data bytes can flow, client and server synchronize sequence numbers:

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant Client as 💻 Client (Browser)
    participant Server as 🖥️ Server (Web Server)

    Note over Client,Server: Connection Establishment (3-Way Handshake)
    Client->>Server: SYN (seq = x) [SYN_SENT]
    Server->>Client: SYN-ACK (seq = y, ack = x + 1) [SYN_RCVD]
    Client->>Server: ACK (ack = y + 1) [ESTABLISHED]

    Note over Client,Server: Bidirectional Data Exchange
    Client->>Server: Data Segment (seq = x + 1, length = 1460)
    Server->>Client: ACK (ack = x + 1461)
\`\`\`

---

## 📈 Congestion Window Dynamics (AIMD)

TCP Reno and modern cubic algorithms use Additive Increase, Multiplicative Decrease (AIMD):

- **Additive Increase**: For each round-trip time without packet loss:
  $$\\text{cwnd} = \\text{cwnd} + 1 \\text{ MSS}$$
- **Multiplicative Decrease**: Upon triple duplicate ACK (loss event):
  $$\\text{ssthresh} = \\frac{\\text{cwnd}}{2}, \\quad \\text{cwnd} = \\text{ssthresh}$$

> [!NOTE]
> When comparing with **Chapter 1**, observe how Layer 4 encapsulates the raw Application Layer data into Segments before handing them to Layer 3 (IP).
`,
      },
      {
        id: 'cn-ch3',
        chapterNumber: 3,
        title: 'Chapter 3: Network Layer: IP Addressing & Routing',
        markdown: `# Chapter 3: Network Layer: IP Addressing & Routing 🛣️
*Course: CS 340 - Computer Networks*
*Author: Student Lecture Notes (Week 5-6)*

---

## 🎯 Learning Objectives
- Understand IPv4 header fields and subnet masking (CIDR)
- Compare Link-State (Dijkstra) and Distance-Vector (Bellman-Ford) routing
- Examine NAT (Network Address Translation) and IPv6 transitions

---

## 🌐 IPv4 Subnetting & CIDR Notation

A Classless Inter-Domain Routing (CIDR) prefix denotes the network mask:

$$/24 \\implies 255.255.255.0 \\implies 2^{32-24} - 2 = 254 \\text{ usable host IPs}$$

| CIDR Prefix | Subnet Mask | Usable Host Addresses | Purpose |
| :--- | :--- | :--- | :--- |
| **/30** | \`255.255.255.252\` | **2** | Point-to-Point Router links |
| **/28** | \`255.255.255.240\` | **14** | Small subnet / department |
| **/24** | \`255.255.255.0\` | **254** | Standard LAN office network |
| **/16** | \`255.255.0.0\` | **65,534** | Large campus or enterprise network |

---

## 🗺️ Routing Algorithms Comparison

Routers compute global shortest paths using two classic algorithmic paradigms:

\`\`\`mermaid
graph LR
    subgraph Link-State [OSPF / IS-IS]
        LS1[Flood Link State Advertisements] --> LS2[Global Network Topology Graph]
        LS2 --> LS3[Run Dijkstra Shortest Path Algorithm]
    end
    subgraph Distance-Vector [RIP / BGP]
        DV1[Exchange Distance Vectors with Immediate Neighbors] --> DV2[Run Bellman-Ford Iteration]
        DV2 --> DV3[Update Local Forwarding Table]
    end
\`\`\`

### Bellman-Ford Distance Equation:
$$d_x(y) = \\min_v \\{ c(x, v) + d_v(y) \\}$$

Where $c(x, v)$ is the cost of the link from node $x$ to immediate neighbor $v$.

> [!IMPORTANT]
> Compare this chapter side-by-side with **Chapter 1** to observe how router hops strip Layer 2 headers while preserving Layer 3 IP headers intact.
`,
      },
    ],
  },
  {
    id: 'cell-biology',
    subjectName: 'Cell Biology (BIO 101)',
    description: '2 paired chapters on organelles and energy metabolism with biochemical reaction pathways',
    chapters: [
      {
        id: 'bio-ch1',
        chapterNumber: 1,
        title: 'Chapter 1: Cellular Structure & Membrane Transport',
        markdown: `# Chapter 1: Cellular Structure & Membrane Transport 🔬
*Course: BIO 101 - Cell Biology*
*Author: Student Revision Notes*

---

## 🧬 Overview of Eukaryotic Organelles

Eukaryotic cells are compartmentalized into specialized membrane-bound organelles:

- **Nucleus**: Stores genomic DNA, coordinates transcription and replication.
- **Mitochondria**: Generates ATP via oxidative phosphorylation (the "powerhouse").
- **Endoplasmic Reticulum (Rough & Smooth)**: Protein synthesis and lipid metabolism.
- **Golgi Apparatus**: Modifies, sorts, and packages glycoproteins for secretion.
- **Lysosomes**: Acidic hydrolytic digestion of cellular waste ($pH \\approx 4.5 - 5.0$).

---

## 🌊 Fluid Mosaic Membrane Architecture

The plasma membrane is a selectively permeable phospholipid bilayer with embedded integral and peripheral proteins:

\`\`\`mermaid
graph TD
    A[Extracellular Fluid] --> B[Outer Phospholipid Leaflet - Hydrophilic Heads]
    B --> C[Hydrophobic Fatty Acid Tail Core]
    C --> D[Inner Phospholipid Leaflet]
    D --> E[Intracellular Cytosol]
    C -.-> F[Cholesterol Molecules - Fluidity Buffer]
    C -.-> G[Integral Transmembrane Channels]
\`\`\`

---

## 🚪 Membrane Transport Mechanisms

| Transport Type | Energy Required? | Direction vs. Gradient | Carrier Protein? | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Simple Diffusion** | No (Passive) | Down gradient ($[High] \\to [Low]$) | No | $O_2, CO_2$, lipid steroids |
| **Facilitated Diffusion** | No (Passive) | Down gradient ($[High] \\to [Low]$) | Yes (GLUT uniporter, aquaporins) | Glucose, $H_2O$ |
| **Primary Active** | **Yes (Direct ATP)** | Against gradient ($[Low] \\to [High]$) | Yes (P-type ATPase) | $Na^+/K^+$ ATPase pump |
| **Secondary Active** | **Yes (Ion Gradient)** | Against gradient | Yes (Symport / Antiport) | $Na^+$-Glucose cotransporter (SGLT) |

> [!TIP]
> Compare this chapter with **Chapter 2** to see how the proton gradient across the inner mitochondrial membrane powers ATP Synthase!
`,
      },
      {
        id: 'bio-ch2',
        chapterNumber: 2,
        title: 'Chapter 2: Cellular Respiration & ATP Synthesis',
        markdown: `# Chapter 2: Cellular Respiration & ATP Synthesis ⚡
*Course: BIO 101 - Cell Biology*
*Author: Student Revision Notes*

---

## 🍬 Complete Oxidation of Glucose

Aerobic cellular respiration converts biochemical energy from nutrients into adenosine triphosphate (ATP):

$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\longrightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\sim 30-32\\text{ ATP} \\quad (\\Delta G^{\\circ\\prime} = -2870 \\text{ kJ/mol})$$

---

## 🔄 Four Key Stages of Respiration

\`\`\`mermaid
graph LR
    A[Glucose] -->|1. Glycolysis in Cytoplasm| B[2 Pyruvate + 2 ATP + 2 NADH]
    B -->|2. Pyruvate Oxidation| C[2 Acetyl-CoA + 2 NADH]
    C -->|3. Citric Acid Cycle / Krebs in Matrix| D[2 ATP + 6 NADH + 2 FADH2]
    D -->|4. Oxidative Phosphorylation on Cristae| E[~26-28 ATP via ATP Synthase]
\`\`\`

---

## 📊 ATP Yield Accounting per Glucose Molecule

| Stage | Cellular Location | Direct ATP (Substrate-Level) | Reduced Coenzymes | Oxidative ATP Produced |
| :--- | :--- | :--- | :--- | :--- |
| **Glycolysis** | Cytosol | **2 ATP** (net) | $2 \\text{ NADH}$ | $\\sim 3 - 5 \\text{ ATP}$ |
| **Pyruvate Dehydrogenase** | Mitochondrial Matrix | 0 | $2 \\text{ NADH}$ | $\\sim 5 \\text{ ATP}$ |
| **Citric Acid (TCA) Cycle** | Mitochondrial Matrix | **2 GTP** ($\\approx 2$ ATP) | $6 \\text{ NADH} + 2 \\text{ FADH}_2$ | $\\sim 18 \\text{ ATP}$ |
| **Total Net Yield** | — | **4 ATP** | — | **$\\sim 30 - 32$ ATP** |

> [!NOTE]
> Notice the critical dependence on mitochondrial structure covered in **Chapter 1**: without the impermeable inner mitochondrial membrane, the proton gradient ($H^+$) would dissipate and no oxidative ATP could be formed!
`,
      },
    ],
  },
];
