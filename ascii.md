You are given a task to integrate an existing React component in the codebase



The codebase should support:

\- shadcn project structure  

\- Tailwind CSS

\- Typescript



If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.



Determine the default path for components and styles. 

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx

hero-ascii-one.tsx

'use client';



import { useEffect } from 'react';



export default function AnimationPage() {

&#x20; useEffect(() => {

&#x20;   const embedScript = document.createElement('script');

&#x20;   embedScript.type = 'text/javascript';

&#x20;   embedScript.textContent = `

&#x20;     !function(){

&#x20;       if(!window.UnicornStudio){

&#x20;         window.UnicornStudio={isInitialized:!1};

&#x20;         var i=document.createElement("script");

&#x20;         i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";

&#x20;         i.onload=function(){

&#x20;           window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)

&#x20;         };

&#x20;         (document.head || document.body).appendChild(i)

&#x20;       }

&#x20;     }();

&#x20;   `;

&#x20;   document.head.appendChild(embedScript);



&#x20;   // Add CSS to hide branding elements and crop canvas

&#x20;   const style = document.createElement('style');

&#x20;   style.textContent = `

&#x20;     \[data-us-project] {

&#x20;       position: relative !important;

&#x20;       overflow: hidden !important;

&#x20;     }

&#x20;     

&#x20;     \[data-us-project] canvas {

&#x20;       clip-path: inset(0 0 10% 0) !important;

&#x20;     }

&#x20;     

&#x20;     \[data-us-project] \* {

&#x20;       pointer-events: none !important;

&#x20;     }

&#x20;     \[data-us-project] a\[href\*="unicorn"],

&#x20;     \[data-us-project] button\[title\*="unicorn"],

&#x20;     \[data-us-project] div\[title\*="Made with"],

&#x20;     \[data-us-project] .unicorn-brand,

&#x20;     \[data-us-project] \[class\*="brand"],

&#x20;     \[data-us-project] \[class\*="credit"],

&#x20;     \[data-us-project] \[class\*="watermark"] {

&#x20;       display: none !important;

&#x20;       visibility: hidden !important;

&#x20;       opacity: 0 !important;

&#x20;       position: absolute !important;

&#x20;       left: -9999px !important;

&#x20;       top: -9999px !important;

&#x20;     }

&#x20;   `;

&#x20;   document.head.appendChild(style);



&#x20;   // Function to aggressively hide branding

&#x20;   const hideBranding = () => {

&#x20;     // Target all possible UnicornStudio containers

&#x20;     const selectors = \[

&#x20;       '\[data-us-project]',

&#x20;       '\[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',

&#x20;       '.unicorn-studio-container',

&#x20;       'canvas\[aria-label\*="Unicorn"]'

&#x20;     ];

&#x20;     

&#x20;     selectors.forEach(selector => {

&#x20;       const containers = document.querySelectorAll(selector);

&#x20;       containers.forEach(container => {

&#x20;         // Find and remove any elements containing branding text

&#x20;         const allElements = container.querySelectorAll('\*');

&#x20;         allElements.forEach(el => {

&#x20;           const text = (el.textContent || '').toLowerCase();

&#x20;           const title = (el.getAttribute('title') || '').toLowerCase();

&#x20;           const href = (el.getAttribute('href') || '').toLowerCase();

&#x20;           

&#x20;           if (

&#x20;             text.includes('made with') || 

&#x20;             text.includes('unicorn') ||

&#x20;             title.includes('made with') ||

&#x20;             title.includes('unicorn') ||

&#x20;             href.includes('unicorn.studio')

&#x20;           ) {

&#x20;             el.style.display = 'none';

&#x20;             el.style.visibility = 'hidden';

&#x20;             el.style.opacity = '0';

&#x20;             el.style.pointerEvents = 'none';

&#x20;             el.style.position = 'absolute';

&#x20;             el.style.left = '-9999px';

&#x20;             el.style.top = '-9999px';

&#x20;             // Also try to remove it

&#x20;             try { el.remove(); } catch(e) {}

&#x20;           }

&#x20;         });

&#x20;       });

&#x20;     });

&#x20;   };



&#x20;   // Run immediately and more frequently

&#x20;   hideBranding();

&#x20;   const interval = setInterval(hideBranding, 50); // More frequent checks

&#x20;   

&#x20;   // Also try after delays

&#x20;   setTimeout(hideBranding, 500);

&#x20;   setTimeout(hideBranding, 1000);

&#x20;   setTimeout(hideBranding, 2000);

&#x20;   setTimeout(hideBranding, 5000);

&#x20;   setTimeout(hideBranding, 10000);



&#x20;   return () => {

&#x20;     clearInterval(interval);

&#x20;     document.head.removeChild(embedScript);

&#x20;     document.head.removeChild(style);

&#x20;   };

&#x20; }, \[]);



&#x20; return (

&#x20;   <main className="relative min-h-screen overflow-hidden bg-black">

&#x20;     {/\* Background Animation \*/}

&#x20;     <div className="absolute inset-0 w-full h-full hidden lg:block">

&#x20;       <div 

&#x20;         data-us-project="OMzqyUv6M3kSnv0JeAtC" 

&#x20;         style={{ width: '100%', height: '100%', minHeight: '100vh' }}

&#x20;       />

&#x20;     </div>



&#x20;     {/\* Mobile stars background \*/}

&#x20;     <div className="absolute inset-0 w-full h-full lg:hidden stars-bg"></div>



&#x20;     {/\* Top Header \*/}

&#x20;     <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/20">

&#x20;       <div className="container mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">

&#x20;         <div className="flex items-center gap-2 lg:gap-4">

&#x20;           <div className="font-mono text-white text-xl lg:text-2xl font-bold tracking-widest italic transform -skew-x-12">

&#x20;             UIMIX

&#x20;           </div>

&#x20;           <div className="h-3 lg:h-4 w-px bg-white/40"></div>

&#x20;           <span className="text-white/60 text-\[8px] lg:text-\[10px] font-mono">EST. 2025</span>

&#x20;         </div>

&#x20;         

&#x20;         <div className="hidden lg:flex items-center gap-3 text-\[10px] font-mono text-white/60">

&#x20;           <span>LAT: 37.7749°</span>

&#x20;           <div className="w-1 h-1 bg-white/40 rounded-full"></div>

&#x20;           <span>LONG: 122.4194°</span>

&#x20;         </div>

&#x20;       </div>

&#x20;     </div>



&#x20;     {/\* Corner Frame Accents \*/}

&#x20;     <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-white/30 z-20"></div>

&#x20;     <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-white/30 z-20"></div>

&#x20;     <div className="absolute left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-white/30 z-20" style={{ bottom: '5vh' }}></div>

&#x20;     <div className="absolute right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-white/30 z-20" style={{ bottom: '5vh' }}></div>



&#x20;     {/\* CTA Content \*/}

&#x20;     <div className="relative z-10 flex min-h-screen items-center justify-end pt-16 lg:pt-0" style={{ marginTop: '5vh' }}>

&#x20;       <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:pr-\[10%]">

&#x20;         <div className="max-w-lg relative lg:ml-auto">

&#x20;           {/\* Top decorative line \*/}

&#x20;           <div className="flex items-center gap-2 mb-3 opacity-60">

&#x20;             <div className="w-8 h-px bg-white"></div>

&#x20;             <span className="text-white text-\[10px] font-mono tracking-wider">∞</span>

&#x20;             <div className="flex-1 h-px bg-white"></div>

&#x20;           </div>



&#x20;           {/\* Title with dithered accent \*/}

&#x20;           <div className="relative">

&#x20;             <div className="hidden lg:block absolute -right-3 top-0 bottom-0 w-1 dither-pattern opacity-40"></div>

&#x20;             <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 leading-tight font-mono tracking-wider whitespace-nowrap lg:-ml-\[5%]" style={{ letterSpacing: '0.1em' }}>

&#x20;               ENDLESS PURSUIT

&#x20;             </h1>

&#x20;           </div>



&#x20;           {/\* Decorative dots pattern - desktop only \*/}

&#x20;           <div className="hidden lg:flex gap-1 mb-3 opacity-40">

&#x20;             {Array.from({ length: 40 }).map((\_, i) => (

&#x20;               <div key={i} className="w-0.5 h-0.5 bg-white rounded-full"></div>

&#x20;             ))}

&#x20;           </div>



&#x20;           {/\* Description with subtle grid pattern \*/}

&#x20;           <div className="relative">

&#x20;             <p className="text-xs lg:text-base text-gray-300 mb-5 lg:mb-6 leading-relaxed font-mono opacity-80">

&#x20;               Like Sisyphus, we push forward — not despite the struggle, but because of it. Every iteration, every pixel, every line of code is our boulder.

&#x20;             </p>

&#x20;             

&#x20;             {/\* Technical corner accent - desktop only \*/}

&#x20;             <div className="hidden lg:block absolute -left-4 top-1/2 w-3 h-3 border border-white opacity-30" style={{ transform: 'translateY(-50%)' }}>

&#x20;               <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white" style={{ transform: 'translate(-50%, -50%)' }}></div>

&#x20;             </div>

&#x20;           </div>



&#x20;           {/\* Buttons with technical accents \*/}

&#x20;           <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">

&#x20;             <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent text-white font-mono text-xs lg:text-sm border border-white hover:bg-white hover:text-black transition-all duration-200 group">

&#x20;               <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>

&#x20;               <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>

&#x20;               BEGIN THE CLIMB

&#x20;             </button>

&#x20;             

&#x20;             <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent border border-white text-white font-mono text-xs lg:text-sm hover:bg-white hover:text-black transition-all duration-200" style={{ borderWidth: '1px' }}>

&#x20;               EMBRACE THE JOURNEY

&#x20;             </button>

&#x20;           </div>



&#x20;           {/\* Bottom technical notation - desktop only \*/}

&#x20;           <div className="hidden lg:flex items-center gap-2 mt-6 opacity-40">

&#x20;             <span className="text-white text-\[9px] font-mono">∞</span>

&#x20;             <div className="flex-1 h-px bg-white"></div>

&#x20;             <span className="text-white text-\[9px] font-mono">SISYPHUS.PROTOCOL</span>

&#x20;           </div>

&#x20;         </div>

&#x20;       </div>

&#x20;     </div>



&#x20;     {/\* Bottom Footer \*/}

&#x20;     <div className="absolute left-0 right-0 z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm" style={{ bottom: '5vh' }}>

&#x20;       <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">

&#x20;         <div className="flex items-center gap-3 lg:gap-6 text-\[8px] lg:text-\[9px] font-mono text-white/50">

&#x20;           <span className="hidden lg:inline">SYSTEM.ACTIVE</span>

&#x20;           <span className="lg:hidden">SYS.ACT</span>

&#x20;           <div className="hidden lg:flex gap-1">

&#x20;             {Array.from({ length: 8 }).map((\_, i) => (

&#x20;               <div key={i} className="w-1 h-3 bg-white/30" style={{ height: `${Math.random() \* 12 + 4}px` }}></div>

&#x20;             ))}

&#x20;           </div>

&#x20;           <span>V1.0.0</span>

&#x20;         </div>

&#x20;         

&#x20;         <div className="flex items-center gap-2 lg:gap-4 text-\[8px] lg:text-\[9px] font-mono text-white/50">

&#x20;           <span className="hidden lg:inline">◐ RENDERING</span>

&#x20;           <div className="flex gap-1">

&#x20;             <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>

&#x20;             <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>

&#x20;             <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>

&#x20;           </div>

&#x20;           <span className="hidden lg:inline">FRAME: ∞</span>

&#x20;         </div>

&#x20;       </div>

&#x20;     </div>



&#x20;     <style jsx>{`

&#x20;       .dither-pattern {

&#x20;         background-image: 

&#x20;           repeating-linear-gradient(0deg, transparent 0px, transparent 1px, white 1px, white 2px),

&#x20;           repeating-linear-gradient(90deg, transparent 0px, transparent 1px, white 1px, white 2px);

&#x20;         background-size: 3px 3px;

&#x20;       }

&#x20;       

&#x20;       .stars-bg {

&#x20;         background-image: 

&#x20;           radial-gradient(1px 1px at 20% 30%, white, transparent),

&#x20;           radial-gradient(1px 1px at 60% 70%, white, transparent),

&#x20;           radial-gradient(1px 1px at 50% 50%, white, transparent),

&#x20;           radial-gradient(1px 1px at 80% 10%, white, transparent),

&#x20;           radial-gradient(1px 1px at 90% 60%, white, transparent),

&#x20;           radial-gradient(1px 1px at 33% 80%, white, transparent),

&#x20;           radial-gradient(1px 1px at 15% 60%, white, transparent),

&#x20;           radial-gradient(1px 1px at 70% 40%, white, transparent);

&#x20;         background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;

&#x20;         background-position: 0% 0%, 40% 40%, 60% 60%, 20% 20%, 80% 80%, 30% 30%, 70% 70%, 50% 50%;

&#x20;         opacity: 0.3;

&#x20;       }

&#x20;     `}</style>

&#x20;   </main>

&#x20; );

}





demo.tsx

import Home from "@/components/ui/hero-ascii-one";



export default function DemoOne() {

&#x20; return (

&#x20;   <div className="w-screen h-screen">

&#x20;     <Home />

&#x20;   </div>

&#x20; );

}



```



Implementation Guidelines

&#x20;1. Analyze the component structure and identify all required dependencies

&#x20;2. Review the component's argumens and state

&#x20;3. Identify any required context providers or hooks and install them

&#x20;4. Questions to Ask

&#x20;- What data/props will be passed to this component?

&#x20;- Are there any specific state management requirements?

&#x20;- Are there any required assets (images, icons, etc.)?

&#x20;- What is the expected responsive behavior?

&#x20;- What is the best place to use this component in the app?



Steps to integrate

&#x20;0. Copy paste all the code above in the correct directories

&#x20;1. Install external dependencies

&#x20;2. Fill image assets with Unsplash stock images you know exist

&#x20;3. Use lucide-react icons for svgs or logos if component requires them



