import sys

with open('src/sections/ShowcaseSection.tsx', 'r') as f:
    content = f.read()

target = """                    {/* Author & Role Overlay at Bottom */}
                    <div className="absolute bottom-3 inset-x-3 text-left">
                      <div className="text-white font-sans font-bold text-sm leading-tight drop-shadow-md">
                        {vid.author}
                      </div>
                      <div className="text-zinc-300 font-sans text-xs drop-shadow-md">
                        {vid.role}
                      </div>
                    </div>"""

replacement = """                    {/* Author & Role Overlay at Bottom */}
                    <div className="absolute bottom-3 inset-x-3 text-left flex justify-between items-end">
                      <div>
                        <div className="text-white font-sans font-bold text-sm leading-tight drop-shadow-md">
                          {vid.author}
                        </div>
                        <div className="text-zinc-300 font-sans text-xs drop-shadow-md">
                          {vid.role}
                        </div>
                      </div>
                      {vid.tiktokUrl && (
                        <a 
                          href={vid.tiktokUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="bg-black/60 hover:bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white border border-zinc-700/50 flex items-center gap-1 transition-colors backdrop-blur-sm"
                        >
                          TikTok
                        </a>
                      )}
                    </div>"""

if target in content:
    content = content.replace(target, replacement)
    
    # Also need to add tiktokUrl in the modal's Author info below the video
    modal_target = """            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
              <span>{selectedVideo.author} • {selectedVideo.role}</span>
              {(selectedVideo.youtubeUrl || selectedVideo.fbUrl) && ("""
              
    modal_replacement = """            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
              <span className="flex items-center gap-2">
                {selectedVideo.author} • {selectedVideo.role}
                {selectedVideo.tiktokUrl && (
                  <a href={selectedVideo.tiktokUrl} target="_blank" rel="noopener noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-white px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition-colors">TikTok</a>
                )}
              </span>
              {(selectedVideo.youtubeUrl || selectedVideo.fbUrl) && ("""
    
    if modal_target in content:
        content = content.replace(modal_target, modal_replacement)
        
    with open('src/sections/ShowcaseSection.tsx', 'w') as f:
        f.write(content)
    print("Patched ShowcaseSection.tsx")
else:
    print("Target not found")
