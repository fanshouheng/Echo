# Implementation Plan: Echo MVP

**Status:** Approved  
**Created:** 2025-10-24  
**Target:** 2 weeks (Day 1-14)  
**Owner:** Echo Project Team

---

## Constitution Compliance Check

Before proceeding, verify alignment with [Echo Project Constitution](../../memory/constitution.md):

- [x] **Generation-First (P1):** MVP focuses purely on generation workflow, no chat features
- [x] **Emotional Authenticity (P2):** 10-12 deep psychological questions, nuanced LLM prompts
- [x] **Visual Excellence (P3):** Design system from PRD Section 9, mobile-first responsive design
- [x] **Privacy & Ethics (P4):** API keys in env vars, no user tracking, content moderation planned
- [x] **Performance (P5):** <30s personality, <60s images, retry logic, progress indicators
- [x] **Simplicity (P6):** MVP scope strictly limited, no feature creep
- [x] **Cultural Appropriateness (P7):** Chinese-first, all content culturally reviewed

**Overall Assessment:** PASS  
**Notes:** MVP scope perfectly aligns with all constitutional principles

---

## Technical Stack

### Frontend Framework
- **React 18.2** with TypeScript 5.3
- **Next.js 14** (App Router)
- **Tailwind CSS 3.4** + **shadcn/ui** components
- **Framer Motion 11** for animations
- **Zustand 4.4** for state management

### Development Tools
- **TypeScript** (strict mode)
- **ESLint** + **Prettier**
- **pnpm** (package manager)

### AI Services
- **OpenAI GPT-4o** (personality generation)
  - Fallback: Claude 3.5 Sonnet
- **Replicate API** with Flux Pro (image generation)
  - Fallback: SDXL

### Utilities
- **html2canvas** (share card generation)
- **zod** (runtime validation)
- **axios** (HTTP client)

### Deployment
- **Vercel** (primary)
- **Environment:** Node.js 20.x

---

## Project Structure

```
echo/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── interview/
│   │   │   └── page.tsx            # Interview flow
│   │   ├── generate/
│   │   │   └── page.tsx            # Generation loading
│   │   ├── profile/
│   │   │   └── [id]/page.tsx       # Echo profile display
│   │   ├── api/
│   │   │   ├── generate-personality/
│   │   │   │   └── route.ts        # LLM API endpoint
│   │   │   └── generate-images/
│   │   │       └── route.ts        # Image API endpoint
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                 # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── interview/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── NavigationButtons.tsx
│   │   ├── generation/
│   │   │   ├── LoadingAnimation.tsx
│   │   │   └── ProgressMessages.tsx
│   │   ├── profile/
│   │   │   ├── PersonalityCard.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── ActionButtons.tsx
│   │   └── share/
│   │       ├── ShareCard.tsx
│   │       └── ShareDialog.tsx
│   │
│   ├── lib/                        # Utility functions
│   │   ├── api/
│   │   │   ├── openai.ts           # OpenAI client
│   │   │   ├── replicate.ts        # Replicate client
│   │   │   └── error-handler.ts    # API error handling
│   │   ├── prompts/
│   │   │   ├── personality.ts      # LLM prompts
│   │   │   └── image.ts            # Image generation prompts
│   │   ├── validators/
│   │   │   └── schemas.ts          # Zod schemas
│   │   └── utils.ts                # General utilities
│   │
│   ├── store/                      # Zustand stores
│   │   ├── interview.ts            # Interview state
│   │   └── echo.ts                 # Echo generation state
│   │
│   ├── types/                      # TypeScript types
│   │   ├── interview.ts
│   │   ├── personality.ts
│   │   └── api.ts
│   │
│   └── data/                       # Static data
│       └── questions.ts            # Interview questions
│
├── public/                         # Static assets
│   ├── images/
│   └── fonts/
│
├── .env.local.example              # Environment template
├── .env.local                      # Local environment (gitignored)
├── next.config.js                  # Next.js config
├── tailwind.config.js              # Tailwind config
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

---

## Key Libraries & Versions

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "tailwindcss": "3.4.0",
    "framer-motion": "11.0.0",
    "zustand": "4.4.7",
    "zod": "3.22.4",
    "axios": "1.6.2",
    "openai": "4.20.1",
    "replicate": "0.25.0",
    "html2canvas": "1.4.1",
    "@radix-ui/react-dialog": "1.0.5",
    "@radix-ui/react-progress": "1.0.3"
  },
  "devDependencies": {
    "@types/node": "20.10.0",
    "@types/react": "18.2.45",
    "eslint": "8.55.0",
    "eslint-config-next": "14.0.4",
    "prettier": "3.1.1",
    "autoprefixer": "10.4.16",
    "postcss": "8.4.32"
  }
}
```

---

## Environment Variables

```bash
# .env.local

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...  # Fallback
REPLICATE_API_TOKEN=r8_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Feature Flags (optional)
ENABLE_VIDEO_GENERATION=false
ENABLE_USER_AUTH=false
```

---

## Development Phases

### Phase 1: Setup & Foundation (Day 1-2)

**Goals:**
- Project initialized
- Design system implemented
- API clients configured

**Deliverables:**
- Working Next.js 14 project
- Tailwind + shadcn/ui configured
- API wrappers tested
- Design tokens from PRD implemented

---

### Phase 2: Interview Flow (Day 3-4)

**Goals:**
- Complete interview experience
- Question bank implemented
- State management working

**Deliverables:**
- 10-12 interview questions in Chinese
- Question card component
- Progress tracking
- Navigation (forward/back)
- Session storage persistence

---

### Phase 3: Personality Generation (Day 5-6)

**Goals:**
- LLM integration working
- Personality profile generated
- Error handling robust

**Deliverables:**
- OpenAI/Claude API integration
- Prompt engineering for Chinese output
- Structured JSON parsing
- Retry logic (max 3 attempts)
- Loading screen with progress messages
- Personality display component

---

### Phase 4: Image Generation (Day 7-9)

**Goals:**
- Visual persona generation
- Image selection UX
- Personality-to-prompt mapping

**Deliverables:**
- Replicate API integration (Flux/SDXL)
- Prompt mapping logic
- 4-image gallery component
- Image selection & regeneration
- Loading screen

---

### Phase 5: Profile Display (Day 10-11)

**Goals:**
- Beautiful Echo profile page
- Complete information display
- Responsive design

**Deliverables:**
- Profile page layout
- Personality card components
- Image display
- Action buttons (share, regenerate, save)
- Mobile-responsive design
- Animations & transitions

---

### Phase 6: Share Functionality (Day 12)

**Goals:**
- Share card generation
- Multi-platform sharing

**Deliverables:**
- Share card template (2-3 designs)
- Canvas-based image generation
- Save to device functionality
- Share dialog component
- Image optimization

---

### Phase 7: Polish & Testing (Day 13-14)

**Goals:**
- Bug fixes
- Performance optimization
- Cross-browser testing
- Deployment

**Deliverables:**
- All critical bugs fixed
- Performance benchmarks met
- Tested on mobile devices
- Deployed to Vercel
- Demo video recorded

---

## API Design

### POST /api/generate-personality

**Request:**
```typescript
{
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;
}
```

**Response:**
```typescript
{
  personality: {
    name: string;
    tagline: string;
    keywords: string[];
    communicationStyle: string;
    values: string;
    whyMatch: string;
    uniqueTraits: string;
  };
  generationTime: number;
}
```

**Error Response:**
```typescript
{
  error: string;
  errorCode: 'VALIDATION_ERROR' | 'GENERATION_FAILED' | 'RATE_LIMIT';
  message: string;  // Chinese
}
```

---

### POST /api/generate-images

**Request:**
```typescript
{
  personality: PersonalityProfile;
  style: 'realistic' | 'illustration' | '3d';
  count: number;  // Default 4
}
```

**Response:**
```typescript
{
  images: Array<{
    url: string;
    seed: number;
  }>;
  generationTime: number;
}
```

---

## Risk Mitigation

### Technical Risks

| Risk | Mitigation |
|------|------------|
| API rate limits | Multiple API keys, rate limiting, queuing |
| Generation failures | Retry logic, fallback providers, cached examples |
| Slow performance | Optimistic UI, streaming responses, aggressive caching |
| Chinese font issues | Web-safe fonts tested early, font subsetting |

### Timeline Risks

| Risk | Mitigation |
|------|------------|
| Scope creep | Strict MVP definition, feature freeze after Day 10 |
| API integration delays | Start integration on Day 1, have fallbacks ready |
| Design iteration | Design system defined upfront from PRD |

---

## Success Criteria

### Must Have (MVP Launch Blockers)
- [x] User can complete interview
- [x] Personality generates in <30s
- [x] Images generate in <60s
- [x] Profile displays beautifully
- [x] Share card generates correctly
- [x] Mobile responsive (375px+)
- [x] All text in Chinese
- [x] No critical bugs

### Nice to Have (Post-Launch)
- [ ] Video generation
- [ ] User accounts
- [ ] Profile history
- [ ] Advanced analytics

---

## Testing Checklist

### Functional Testing
- [ ] Complete interview flow (happy path)
- [ ] Regenerate personality (keep answers)
- [ ] Regenerate images (keep personality)
- [ ] Share card generation
- [ ] All navigation works
- [ ] Back button in interview
- [ ] Error states display correctly

### Performance Testing
- [ ] Personality generation <30s
- [ ] Image generation <60s
- [ ] Page load <2s
- [ ] Share card <3s

### Cross-Browser
- [ ] Chrome (desktop + mobile)
- [ ] Safari (iOS)
- [ ] WeChat browser

### Device Testing
- [ ] iPhone 12/13/14 (various sizes)
- [ ] Android (common resolutions)
- [ ] iPad
- [ ] Desktop (1920px)

---

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured on Vercel
- [ ] API keys valid and funded
- [ ] Domain configured (if custom)
- [ ] Analytics setup (optional)
- [ ] Error tracking (Sentry optional)

### Deployment
- [ ] Deploy to Vercel
- [ ] Verify all pages load
- [ ] Test API endpoints
- [ ] Check mobile responsiveness
- [ ] Verify share functionality

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check API usage
- [ ] Test on real devices
- [ ] Record demo video
- [ ] Submit to contest

---

**Approval Status:** Approved for implementation  
**Approved by:** Echo Project Lead  
**Date:** 2025-10-24

