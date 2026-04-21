# Video Call Room Integration Walkthrough

The Agora Video Call subsystem has been successfully integrated into your consultant dashboard prototype. We strictly adhered to your requirement for a **mocked, backend-ready** layout that implements the actual SDK without tying it deeply to missing API services.

Here is an overview of what was built:

## Core SDK Integration
We bypassed complex wrapper libraries and installed `agora-rtc-sdk-ng` directly. 
I built a specialized React Hook at [useRealTimeCall.ts](file:///c:/office-project/Ereabuk-admin-dashboard-/src/hooks/useRealTimeCall.ts) that initializes the Agora Engine asynchronously. This specific pattern avoids SSR crashing in Next.js while still correctly managing the `join`, `publish`, and `subscribe` video feeds using browser constraints natively.

## Page Architecture
When a user clicks "Join Call" from their `IncomingRequests.tsx` component, `next/router` hooks immediately direct them to the newly generated `src/app/call/page.tsx`.

The page is a full-screen, split-pane architecture composed of two isolated components:
> [!NOTE]
> By rendering outside of the `(consultant)` layout container, this standalone route ensures sidebars/headers don't crop the video experience.

### 🎥 The Video Workspace
[VideoWorkspace.tsx](file:///c:/office-project/Ereabuk-admin-dashboard-/src/components/call/VideoWorkspace.tsx) handles the raw media feeds.
- If you're the first to join, it plays an aesthetic "Waiting for others to join" loading sequence.
- When connected, your local camera shrinks to a stylistic "Picture-in-Picture" hovering panel in the top right.
- It features an overlay control array handling active Mic-muting and Video-shutoff states tied directly to the Agora stream payload!

### 📊 The Session Sidebar
[SessionSidebar.tsx](file:///c:/office-project/Ereabuk-admin-dashboard-/src/components/call/SessionSidebar.tsx) renders the right-panel context.
- **Auto-Biller:** A `setInterval` tracker clocks up in `MM:SS` and simultaneously calculates your live `$1.00/min` rate dynamically printing it inside the dashboard metrics.
- **Scroll Ticker:** To showcase what a backend whisper-integration will look like, an automated looping array progressively dumps fake meeting transcripts onto the screen every `8` seconds, auto-scrolling to the bottom as people "talk".

## Getting Started / Next Steps
You can navigate to this view immediately by accepting an Instant Request in your dashboard and clicking the green **Join Call** button!

> [!WARNING]
> Because we are currently injecting `token: null` and a mock `roomId` to fulfill the prototype requirements, the application will attempt to initialize video/audio hardware from your browser exactly as it should. If you want to test actual connection across devices right now, you can patch your actual Agora App ID string directly into standard variables placed at the top of `src/app/call/page.tsx`!
