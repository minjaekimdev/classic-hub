<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the ClassicHub frontend. PostHog is initialized in `src/app/main.tsx` alongside the existing Sentry integration, with `PostHogProvider` wrapping the entire app so that `usePostHog()` is available everywhere. Environment variables (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`) are set in `.env`. The `OAuthButton` component was updated to accept and forward an `onClick` prop to support login/signup tracking.

**Important:** Run the following command to install the required packages before building:
```bash
cd packages/frontend
npm add posthog-js @posthog/react
```

## Events instrumented

| Event | Description | File |
|---|---|---|
| `performance_detail_viewed` | User views a performance detail page — top of conversion funnel | `src/pages/Detail.tsx` |
| `ticket_vendor_clicked` | User clicks a ticket vendor link to book — primary conversion event | `src/features/booking/TicketVendor.tsx` |
| `search_performed` | User submits a search with keyword, location, price, and/or date filters | `src/features/filter/hooks/useSearchFilter.ts` |
| `performance_bookmarked` | User bookmarks (찜) a performance | `src/shared/ui/buttons/BookmarkButtonWithText.tsx`, `src/shared/ui/buttons/BookmarkButtonDesktop.tsx` |
| `performance_bookmark_removed` | User removes a bookmark from a performance | `src/shared/ui/buttons/BookmarkButtonWithText.tsx`, `src/shared/ui/buttons/BookmarkButtonDesktop.tsx` |
| `performance_shared` | User copies the share link for a performance | `src/shared/ui/buttons/ShareButtonWithText.tsx` |
| `feedback_submitted` | User submits feedback via the feedback modal | `src/features/feedback/FeedbackModal.hook.ts` |
| `login_clicked` | User clicks the Google OAuth login button | `src/features/auth/LoginModal.tsx` |
| `signup_clicked` | User clicks the Google OAuth signup button | `src/features/auth/SignupModal.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/367899/dashboard/1428137
- **Booking Conversion Funnel (Detail View → Ticket Click):** https://us.posthog.com/project/367899/insights/yojzcChF
- **Performance Detail Views — Daily Trend:** https://us.posthog.com/project/367899/insights/5zJdN6AN
- **Search Performed — Daily Trend:** https://us.posthog.com/project/367899/insights/NsA2k2IL
- **Bookmark Actions — Added vs Removed:** https://us.posthog.com/project/367899/insights/fYHKFVQ4
- **Login & Signup Clicks — Daily Trend:** https://us.posthog.com/project/367899/insights/eelb01o2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
