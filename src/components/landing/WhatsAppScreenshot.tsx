import React from 'react';

interface WhatsAppScreenshotProps {
  name: string;
  text: string;
  time: string;
  avatarBg?: string;
}

export function WhatsAppScreenshot({ name, text, time, avatarBg = "bg-[#FF3366]" }: WhatsAppScreenshotProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0b141a] shadow-xl text-left select-none max-w-sm mx-auto flex flex-col">
      {/* Header bar */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]/20">
        <div className="flex items-center gap-3">
          {/* Back Arrow */}
          <span className="text-white/70 text-sm cursor-pointer hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </span>
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center font-black text-xs text-white`}>
              {name.split(" ")[0].substring(0, 2).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00e676] rounded-full border-2 border-[#1f2c34]" />
          </div>
          {/* Name & custom status */}
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs sm:text-sm leading-none flex items-center gap-1.5 flex-wrap">
              {name}
            </span>
            <span className="text-[#00e676] text-[10px] font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1 h-1 bg-[#00e676] rounded-full animate-pulse inline-block" />
              online
            </span>
          </div>
        </div>
        {/* Call icons right side */}
        <div className="flex items-center gap-3.5 text-white/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" className="cursor-pointer hover:text-white transition-colors">
            <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="cursor-pointer hover:text-white transition-colors">
            <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="cursor-pointer hover:text-white transition-colors">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
        </div>
      </div>
      
      {/* Screen body wallpaper */}
      <div 
        className="p-4 min-h-[140px] relative flex flex-col justify-end gap-3"
        style={{
          backgroundColor: '#0b141a',
          backgroundImage: 'radial-gradient(rgba(32, 44, 51, 0.4) 1px, transparent 0)',
          backgroundSize: '16px 16px'
        }}
      >
        {/* Subtle decorative "Doodle-like" transparent vectors */}
        <div className="absolute inset-0 bg-black/15 mix-blend-overlay opacity-30 pointer-events-none" />

        {/* Message Bubble (Left / Received) */}
        <div className="relative max-w-[88%] bg-[#202c33] text-white py-2 px-3.5 rounded-2xl rounded-tl-none border-b border-[#2a3942]/10 self-start shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
          {/* Arrow pointing left */}
          <div className="absolute -left-1.5 top-0 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#202c33]" />
          
          <p className="text-xs sm:text-[13.5px] leading-relaxed font-semibold text-[#e9edef] antialiased">
            {text}
          </p>

          {/* Time & Bubble Ticks */}
          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8696a0] select-none font-semibold leading-none">
            <span>{time}</span>
            <span className="text-[#53bdeb]">
              {/* Double Blue Checked Symbol */}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16" className="inline-block">
                <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.5.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.354 10.5l3.5-3.5a.5.5 0 0 1 .708.708l-4 4z"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
