// import { useState, useEffect } from "react";
// import { FaPlay, FaPause } from "react-icons/fa";
// import { MdLoop } from "react-icons/md";

// const VideoEmbedder = () => {
//   const [videoURL, setVideoURL] = useState("");
//   const [videoId, setVideoId] = useState("");
//   const [isPlaying, setIsPlaying] = useState(false); // To track if the video is playing
//   const [player, setPlayer] = useState(null); // YouTube player instance

//   // Function to extract video ID from URL
//   const extractVideoId = (url) => {
//     const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]*\/\S+\/|\S+\/|\S*)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(regExp);
//     return match ? match[1] : null;
//   };

//   // Handle the change in input field
//   const handleChange = (e) => {
//     const url = e.target.value;
//     setVideoURL(url);
//     const extractedVideoId = extractVideoId(url);
//     setVideoId(extractedVideoId);
//   };

//   // Function to load the YouTube IFrame API
//   const loadYouTubeAPI = () => {
//     return new Promise((resolve, reject) => {
//       if (window.YT) {
//         resolve(window.YT); // If the API is already loaded, resolve immediately
//       } else {
//         const script = document.createElement("script");
//         script.src = "https://www.youtube.com/iframe_api";
//         script.onload = () => resolve(window.YT);
//         script.onerror = () => reject(new Error("Failed to load YouTube API script"));
//         document.body.appendChild(script);
//       }
//     });
//   };

//   // Initialize the YouTube player and handle the loop functionality
//   useEffect(() => {
//     if (!videoId) return; // Only load player if videoId is valid

//     // Load the YouTube API
//     loadYouTubeAPI()
//       .then(() => {
//         // The YouTube IFrame API script has been loaded successfully, now create the player
//         if (window.YT && window.YT.Player) {
//           const newPlayer = new window.YT.Player("video-iframe", {
//             videoId,
//             events: {
//               onReady: (event) => {
//                 event.target.setLoop(true); // Enable looping when ready
//               },
//               onStateChange: (event) => {
//                 if (event.data === window.YT.PlayerState.PLAYING) {
//                   setIsPlaying(true);
//                 } else if (event.data === window.YT.PlayerState.PAUSED) {
//                   setIsPlaying(false);
//                 } else if (event.data === window.YT.PlayerState.ENDED) {
//                   // If the video has ended, replay it.
//                   event.target.playVideo();
//                 }
//               },
//             },
//           });
//           setPlayer(newPlayer);
//         } else {
//           console.error("YT.Player is not available.");
//         }
//       })
//       .catch((error) => {
//         console.error("YouTube API failed to load:", error);
//       });

//     // Cleanup player on component unmount
//     return () => {
//       if (player) {
//         player.destroy();
//       }
//     };
//   }, [videoId]); // Re-run the effect when videoId changes

//   // Play or pause the video
//   const handlePlayPause = () => {
//     if (isPlaying) {
//       player.pauseVideo(); // Pause the video
//     } else {
//       player.playVideo(); // Play the video
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col max-w-[500px] m-auto">
//         <label htmlFor="url" className="text-gray-300 mb-1">Please paste YouTube URL or Video ID</label>
//         <input
//           type="text"
//           value={videoURL}
//           onChange={handleChange}
//           placeholder="Enter YouTube URL"
//           className="p-2 bg-gray-200 rounded-md font-semibold"
//         />
//       </div>

//       {videoId && (
//         <>
//           <hr className="border-2 border-gray-700 my-10" />
//           <div className="p-5 bg-slate-700 w-fit m-auto my-10 rounded shadow-lg">
//             <div id="video-iframe">
//               {/* YouTube iframe will be inserted here by YouTube API */}
//             </div>
//             <div className="flex gap-3 mt-5 justify-center">
//               <MdLoop color="lightgray" size={24} />
//               <div onClick={handlePlayPause}>
//                 {isPlaying ? (
//                   <FaPause color="lightgray" size={24} />
//                 ) : (
//                   <FaPlay color="lightgray" size={24} />
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VideoEmbedder;


import { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdLoop } from "react-icons/md";
import ReactSlider from "react-slider"; // Import the slider component

const VideoEmbedder = () => {
  const [videoURL, setVideoURL] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false); // To track if the video is playing
  const [player, setPlayer] = useState(null); // YouTube player instance
  const [looping, setLooping] = useState(false); // To track if the loop is enabled
  const [videoDuration, setVideoDuration] = useState(0); // To store the video duration
  const [loopRange, setLoopRange] = useState([0, 100]); // Start and End time for the loop

  // Function to format seconds into hh:mm:ss or mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      // Format as hh:mm:ss if hours are greater than 0
      return `${padNumber(hours)}:${padNumber(remainingMinutes)}:${padNumber(remainingSeconds)}`;
    } else {
      // Format as mm:ss if less than 1 hour
      return `${padNumber(remainingMinutes)}:${padNumber(remainingSeconds)}`;
    }
  };

  // Helper function to add leading zeros for single digit numbers
  const padNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  // Function to extract video ID from URL
  const extractVideoId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]*\/\S+\/|\S+\/|\S*)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Handle the change in input field
  const handleChange = (e) => {
    const url = e.target.value;
    setVideoURL(url);
    const extractedVideoId = extractVideoId(url);
    setVideoId(extractedVideoId);
  };

  // Function to load the YouTube IFrame API
  const loadYouTubeAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.YT) {
        resolve(window.YT); // If the API is already loaded, resolve immediately
      } else {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => resolve(window.YT);
        script.onerror = () => reject(new Error("Failed to load YouTube API script"));
        document.body.appendChild(script);
      }
    });
  };

  // Initialize the YouTube player and handle the loop functionality
  useEffect(() => {
    if (!videoId) return; // Only load player if videoId is valid

    // Load the YouTube API
    loadYouTubeAPI()
      .then(() => {
        // The YouTube IFrame API script has been loaded successfully, now create the player
        if (window.YT && window.YT.Player) {
          const newPlayer = new window.YT.Player("video-iframe", {
            videoId,
            events: {
              onReady: (event) => {
                const duration = event.target.getDuration(); // Get the video duration when ready
                setVideoDuration(duration); // Set the video duration state
                event.target.setLoop(true); // Enable looping when ready
              },
              onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  // If the video has ended, replay it.
                  if (looping) {
                    event.target.seekTo(loopRange[0], true); // Seek back to the initial time
                  }
                }
              },
            },
          });
          setPlayer(newPlayer);
        } else {
          console.error("YT Player is not available.");
        }
      })
      .catch((error) => {
        console.error("YouTube API failed to load:", error);
      });

    // Cleanup player on component unmount
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId, loopRange, looping]); // Re-run the effect when videoId or loopRange changes

  // Update loopRange when videoDuration updated
  useEffect(() => {
    if (videoDuration > 0) {
      setLoopRange([0, videoDuration]);
    }
  }, [videoDuration]);  

  // Handle the loop play logic
  const handleLoop = () => {
    if (player) {
      setLooping(true);
      player.seekTo(loopRange[0], true); // Seek to the initial time
      player.playVideo(); // Start the video
    }
  };

  // Play or pause the video
  const handlePlayPause = () => {
    if (isPlaying) {
      player.pauseVideo(); // Pause the video
    } else {
      player.playVideo(); // Play the video
    }
  };

  return (
    <div>
      <div className="flex flex-col max-w-[500px] m-auto">
        <label htmlFor="url" className="text-gray-300 mb-1">Please paste YouTube URL or Video ID</label>
        <input
          type="text"
          value={videoURL}
          onChange={handleChange}
          placeholder="Enter YouTube URL"
          className="p-2 bg-gray-200 rounded-md font-semibold"
        />
      </div>

      {videoId && (
        <>
          <hr className="border-2 border-gray-700 my-10" />
          <div className="p-5 bg-slate-700 w-fit m-auto my-10 rounded shadow-lg">
            <div id="video-iframe">
              {/* YouTube iframe will be inserted here by YouTube API */}
            </div>

            {/* Single Slider with Two Handles */}
            <div className="mt-5">
              <ReactSlider
                min={0}
                max={videoDuration}
                step={0.1}
                value={loopRange}
                onChange={(newRange) => setLoopRange(newRange)} // Update loop range on slider change
                renderThumb={(props, state) => (
                  <div
                      {...props}
                      className="relative w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center"
                    >
                      {/* Display value as label */}
                      <span className="absolute -top-6 text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded shadow-md">
                        {formatTime(state.valueNow)}
                      </span>
                    </div>
                  )}                       
                renderTrack={(props, state) => (
                  <div
                    {...props}
                    className={`h-3 rounded-full ${
                      state.index === 0
                        ? "bg-gradient-to-r from-gray-700 via-gray-500 to-gray-200"
                        : "bg-gray-200"
                    }`}
                  />
                )}
                className="w-full mt-3"
                pearling
              />
            </div>

            <div className="flex gap-3 mt-10 justify-center">
              <MdLoop color="lightgray" size={24} onClick={handleLoop} />
              <div onClick={handlePlayPause}>
                {isPlaying ? (
                  <FaPause color="lightgray" size={24} />
                ) : (
                  <FaPlay color="lightgray" size={24} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoEmbedder;
