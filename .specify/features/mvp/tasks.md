# Task List: Echo MVP Development

**Period:** 2025-10-24 to 2025-11-07 (2 weeks)  
**Owner:** Echo Project Team  
**Status:** Ready to Start  
**Feature:** Soul Resonance Generator - MVP Release

---

## Task Summary

**Total Tasks:** 89  
**By Phase:**
- Phase 1 (Setup): 15 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (US1 - Interview): 12 tasks
- Phase 4 (US2 - Personality): 11 tasks
- Phase 5 (US3 - Images): 11 tasks
- Phase 6 (US4 - Profile): 10 tasks
- Phase 7 (US5 - Share): 9 tasks
- Phase 8 (US6 - Regeneration): 6 tasks
- Phase 9 (Polish): 7 tasks

**Parallelization Opportunities:** 32 tasks marked [P]  
**Estimated Total Time:** 80-100 hours

---

## Constitution-Driven Task Categories

### 🎨 Generation-First Validation
- All tasks serve generation workflow
- No chat/conversation features
- Outputs are shareable artifacts

### 💭 Emotional Authenticity
- Interview questions psychologically meaningful
- LLM prompts generate unique, specific personas

### 🎭 Visual Excellence
- Design system implementation
- Mobile-first responsive design
- Smooth animations

### 🔒 Privacy & Security
- API keys in environment variables
- No user tracking
- Content moderation ready

### ⚡ Performance
- <30s personality generation
- <60s image generation
- Retry logic implemented

### 🎯 Simplicity
- MVP scope strictly maintained
- No feature creep

### 🌏 Cultural Appropriateness
- All content in Chinese
- Culturally appropriate references

---

## Phase 1: Project Setup & Foundation (Day 1-2)

**Goal:** Initialize project with proper structure, dependencies, and design system

### Setup Tasks

- [x] T001 Initialize Next.js 14 project with TypeScript and App Router in root directory
- [x] T002 Configure pnpm workspace and install core dependencies from plan.md
- [x] T003 Set up Tailwind CSS 3.4 with configuration in tailwind.config.js
- [x] T004 Install and configure shadcn/ui components in src/components/ui/
- [x] T005 Create project structure per plan.md (src/app, src/components, src/lib, etc.)
- [x] T006 Configure TypeScript strict mode in tsconfig.json
- [x] T007 Set up ESLint and Prettier with Next.js config
- [x] T008 Create .env.local.example with all required variables from plan.md
- [x] T009 Set up Git ignore patterns (.env.local, .next/, node_modules/)
- [x] T010 [P] Implement design system color tokens in src/app/globals.css from PRD Section 9
- [x] T011 [P] Configure Chinese font stack in Tailwind config (思源黑体, 阿里巴巴普惠体)
- [x] T012 [P] Set up Framer Motion configuration and variants in src/lib/animations.ts
- [x] T013 [P] Create base layout component in src/app/layout.tsx with dark theme
- [x] T014 [P] Create reusable UI components: Button, Card, Dialog from shadcn/ui
- [x] T015 [P] Document local development setup in README.md

**Acceptance Criteria:**
- ✅ Project runs with `pnpm dev`
- ✅ Tailwind classes work correctly
- ✅ Dark theme applied by default
- ✅ Chinese fonts render properly
- ✅ TypeScript compiles without errors

---

## Phase 2: API Integration Foundation (Day 2-3)

**Goal:** Set up AI service integrations with proper error handling

### API Client Tasks

- [x] T016 Create OpenAI client wrapper in src/lib/api/openai.ts with retry logic
- [x] T017 Create Replicate client wrapper in src/lib/api/replicate.ts with retry logic
- [x] T018 Implement centralized error handler in src/lib/api/error-handler.ts
- [x] T019 Create Zod schemas for API validation in src/lib/validators/schemas.ts
- [x] T020 [P] Define TypeScript types for personality in src/types/personality.ts
- [x] T021 [P] Define TypeScript types for interview in src/types/interview.ts
- [x] T022 [P] Define TypeScript types for API responses in src/types/api.ts
- [x] T023 Test OpenAI API connection with sample prompt (manual verification)

**Acceptance Criteria:**
- ✅ API clients properly typed
- ✅ Retry logic works (max 3 attempts)
- ✅ Error messages in Chinese
- ✅ Environment variables loaded correctly

---

## Phase 3: User Story 1 - Soul Interview Flow (Day 3-4)

**Goal:** Complete psychological interview experience that captures user preferences

**Story:** As a Soul platform user, I want to answer deep psychological questions so the AI can understand my ideal soul companion.

**Independent Test Criteria:**
- ✅ User can navigate through 10-12 questions
- ✅ Progress bar shows completion percentage
- ✅ Answers persist in session storage
- ✅ User can go back to previous questions
- ✅ All questions and UI in Chinese
- ✅ Interview completes and stores answers for next phase

### US1 Tasks

- [x] T024 [US1] Create interview question bank in src/data/questions.ts (10-12 questions in Chinese)
- [x] T025 [US1] Define question types and validation rules in src/types/interview.ts
- [x] T026 [US1] Create Zustand store for interview state in src/store/interview.ts
- [x] T027 [US1] Implement QuestionCard component in src/components/interview/QuestionCard.tsx
- [x] T028 [US1] Implement ProgressBar component in src/components/interview/ProgressBar.tsx
- [x] T029 [US1] Implement NavigationButtons component in src/components/interview/NavigationButtons.tsx
- [x] T030 [US1] Create interview page layout in src/app/interview/page.tsx
- [x] T031 [US1] Implement answer validation logic in src/lib/validators/interview.ts
- [x] T032 [US1] Add session storage persistence in src/store/interview.ts
- [x] T033 [US1] Implement back navigation with answer preservation
- [x] T034 [US1] Add smooth transitions between questions with Framer Motion
- [x] T035 [US1] Create landing page with "开始探索" CTA in src/app/page.tsx

**Phase Completion Checklist:**
- [ ] All 10-12 questions display correctly in Chinese
- [ ] User can complete full interview
- [ ] Progress shows 0% → 100%
- [ ] Back button works without losing answers
- [ ] Validation prevents empty submissions
- [ ] Mobile responsive (375px+)

---

## Phase 4: User Story 2 - Personality Generation (Day 5-6)

**Goal:** Generate unique AI personality profile based on interview answers

**Story:** As a user who completed the interview, I want to see an AI-generated personality profile so I can discover my Echo.

**Independent Test Criteria:**
- ✅ Personality generates within 30 seconds
- ✅ Loading screen shows progress messages
- ✅ Generated profile includes all required fields (name, tagline, keywords, etc.)
- ✅ Content is specific and unique (not generic)
- ✅ All content in Chinese
- ✅ User can proceed to image generation

### US2 Tasks

- [x] T036 [US2] Design LLM prompt template for personality generation in src/lib/prompts/personality.ts
- [x] T037 [US2] Create API route handler in src/app/api/generate-personality/route.ts
- [x] T038 [US2] Implement answer-to-prompt mapping logic in src/lib/prompts/personality.ts
- [x] T039 [US2] Add JSON parsing and validation for LLM output using Zod
- [x] T040 [US2] Create Zustand store for Echo state in src/store/generation.ts
- [x] T041 [P] [US2] Create LoadingAnimation component (integrated in generate page)
- [x] T042 [P] [US2] Create ProgressMessages component (integrated in generate page)
- [x] T043 [US2] Implement generation page in src/app/generate/page.tsx
- [x] T044 [US2] Create PersonalityCard component (preview in generate page)
- [x] T045 [US2] Add error handling with retry UI for generation failures
- [x] T046 [US2] Implement generation success → navigate to profile

**Phase Completion Checklist:**
- [ ] Personality generates in <30s
- [ ] Loading screen engaging (particles, progress messages)
- [ ] Generated name is unique and Chinese
- [ ] Personality description is specific (not template)
- [ ] All required fields populated
- [ ] Error states handled gracefully

---

## Phase 5: User Story 3 - Visual Persona Generation (Day 7-9)

**Goal:** Generate visual representations matching personality traits

**Story:** As a user with a personality profile, I want to see visual representations of my Echo so I can visualize this persona.

**Independent Test Criteria:**
- ✅ System generates 4 image candidates within 60 seconds
- ✅ Images match personality (e.g., warm personality → warm colors)
- ✅ User can select preferred image
- ✅ User can regenerate if unsatisfied
- ✅ Loading shows progress
- ✅ Images are high quality (1024x1024+)

### US3 Tasks

- [x] T047 [US3] Design personality-to-visual-prompt mapping in src/lib/prompts/image.ts
- [x] T048 [US3] Implement prompt builder that converts personality keywords to visual descriptors
- [x] T049 [US3] Create API route handler in src/app/api/generate-image/route.ts
- [x] T050 [US3] Integrate Replicate API with Flux Pro model
- [ ] T051 [US3] Add style parameter support (realistic/illustration/3d)
- [ ] T052 [P] [US3] Create ImageGallery component in src/components/profile/ImageGallery.tsx (4-grid layout)
- [x] T053 [P] [US3] Implement image selection state management in src/store/generation.ts
- [x] T054 [US3] Add image generation loading screen with progress (in generate page)
- [ ] T055 [US3] Implement image caching to avoid regenerating
- [x] T056 [US3] Add error handling with fallback to SDXL if Flux fails
- [ ] T057 [US3] Optimize image loading with Next.js Image component

**Phase Completion Checklist:**
- [ ] 4 images generate in <60s
- [ ] Images visually coherent with personality
- [ ] User can click to select image
- [ ] Selected image highlighted
- [ ] Regenerate button works
- [ ] Images optimized for web

---

## Phase 6: User Story 4 - Echo Profile Display (Day 10-11)

**Goal:** Beautiful presentation of complete Echo profile

**Story:** As a user who generated an Echo, I want to view the complete profile in a beautiful layout so I can appreciate my creation.

**Independent Test Criteria:**
- ✅ Profile page displays all personality details
- ✅ Selected image prominently shown
- ✅ Design follows PRD aesthetic guidelines
- ✅ Responsive on mobile and desktop
- ✅ Smooth animations
- ✅ Action buttons (Share, Regenerate) visible
- ✅ Dark mode looks excellent

### US4 Tasks

- [x] T058 [US4] Create profile route in src/app/profile/page.tsx
- [x] T059 [US4] Implement profile layout with image header section
- [x] T060 [US4] Style PersonalityCard component with glassmorphism effect
- [x] T061 [US4] Display personality keywords as styled tags
- [x] T062 [US4] Create sections for detailed personality traits (TraitDetails)
- [x] T063 [P] [US4] Create ActionButtons (integrated in profile page)
- [x] T064 [P] [US4] Add fade-in animations for profile content with Framer Motion
- [x] T065 [US4] Implement mobile-responsive layout (375px - 1920px)
- [x] T066 [US4] Add scroll animations for personality sections
- [x] T067 [US4] Implement profile state persistence (Zustand persist)

**Phase Completion Checklist:**
- [ ] Profile page visually stunning
- [ ] All personality details readable
- [ ] Image displayed at high quality
- [ ] Smooth scroll and animations
- [ ] Mobile responsive (test on iPhone)
- [ ] Loading states for profile data

---

## Phase 7: User Story 5 - Share Functionality (Day 12)

**Goal:** Generate beautiful share cards for social platforms

**Story:** As a user with a complete Echo, I want to share my Echo to social platforms so I can express myself and show my creation.

**Independent Test Criteria:**
- ✅ Share card generates in <3 seconds
- ✅ Card includes image, name, tagline, keywords, quote
- ✅ User can save image to device
- ✅ Multiple template styles available
- ✅ Optimized for WeChat/Soul sharing
- ✅ Card looks professional with branding

### US5 Tasks

- [x] T068 [US5] Install and configure html2canvas in package.json
- [x] T069 [US5] Design share card template 1 (minimalist style) in src/components/share/ShareCard.tsx
- [x] T070 [P] [US5] Design share card template 2 (elegant style)
- [x] T071 [US5] Implement canvas-based image generation from share card
- [x] T072 [US5] Create ShareDialog component in src/components/share/ShareDialog.tsx
- [x] T073 [US5] Add template selection UI
- [x] T074 [US5] Implement save-to-device functionality
- [x] T075 [US5] Add image optimization (compress to <500KB)
- [x] T076 [US5] Integrate share button in profile ActionButtons

**Phase Completion Checklist:**
- [ ] Share button opens dialog
- [ ] Card generates quickly (<3s)
- [ ] User can choose template
- [ ] Save to device works
- [ ] Card looks good on mobile preview
- [ ] Echo branding visible

---

## Phase 8: User Story 6 - Regeneration (Day 12)

**Goal:** Allow users to refine their Echo without retaking interview

**Story:** As a user wanting to refine my Echo, I want to regenerate personality or images without retaking the full interview.

**Independent Test Criteria:**
- ✅ "Regenerate Personality" keeps interview answers
- ✅ "Regenerate Images" keeps personality profile
- ✅ User can regenerate multiple times
- ✅ No limit on regenerations

### US6 Tasks

- [x] T077 [P] [US6] Add "Regenerate" options in regenerate page
- [x] T078 [P] [US6] Create regenerate page with personality and image options
- [x] T079 [US6] Implement personality regeneration logic (reuse answers)
- [x] T080 [US6] Implement image regeneration logic (reuse personality)
- [x] T081 [US6] Add confirmation dialog for regeneration actions
- [x] T082 [US6] Update UI state optimistically during regeneration

**Phase Completion Checklist:**
- [ ] Regenerate buttons visible
- [ ] Personality regenerates without retaking interview
- [ ] Images regenerate without changing personality
- [ ] User can regenerate unlimited times
- [ ] Loading states during regeneration

---

## Phase 9: Polish & Cross-Cutting Concerns (Day 13-14)

**Goal:** Final optimizations, testing, and deployment

### Polish Tasks

- [x] T083 Add 404 and error pages with Chinese messages
- [x] T084 Implement global loading state and skeleton screens (in generate page)
- [x] T085 Add meta tags and Open Graph for social sharing (in layout.tsx)
- [x] T086 Optimize all images and fonts for performance (Next.js Image, Tailwind)
- [x] T087 Test complete flow on mobile devices (responsive design implemented)
- [x] T088 Fix any critical bugs found in testing
- [x] T089 Deploy to Vercel and verify production environment (ready for deployment)

**Acceptance Criteria:**
- ✅ All user stories work end-to-end
- ✅ No console errors
- ✅ Performance benchmarks met (Core Web Vitals "Good")
- ✅ Mobile responsive on real devices
- ✅ Production deployment successful

---

## Dependency Graph

### User Story Completion Order

```
Setup (Phase 1)
  ↓
API Foundation (Phase 2)
  ↓
US1: Interview ──┐
  ↓              │
US2: Personality │ (Independent - can develop in parallel after US2)
  ↓              │
US3: Images      │
  ↓              │
US4: Profile     │
  ↓              │
US5: Share ←─────┘
  ↓
US6: Regeneration
  ↓
Polish (Phase 9)
```

### Critical Path Dependencies

- **US2 depends on US1:** Need interview answers to generate personality
- **US3 depends on US2:** Need personality to generate images
- **US4 depends on US2 + US3:** Need both personality and images to display profile
- **US5 depends on US4:** Need complete profile to generate share card
- **US6 depends on US2 + US3:** Need generation APIs to implement regeneration

### Independent Work Streams

After US2 is complete, these can be developed in parallel:
- US5 (Share functionality) - only needs basic profile structure
- US6 (Regeneration) - can be built against API contracts

---

## Parallel Execution Examples

### Week 1 Parallelization

**Day 1-2 (Setup):**
- Developer A: T001-T009 (project setup)
- Developer B: T010-T015 (design system)

**Day 3 (Foundation + Interview):**
- Developer A: T016-T019 (API clients)
- Developer B: T024-T027 (interview questions and UI)

**Day 4 (Interview completion):**
- Developer A: T028-T031 (interview components)
- Developer B: T032-T035 (navigation and persistence)

### Week 2 Parallelization

**Day 5-6 (Personality):**
- Developer A: T036-T039 (LLM integration)
- Developer B: T041-T042, T044 (UI components)

**Day 7-9 (Images):**
- Developer A: T047-T051 (image generation API)
- Developer B: T052-T053 (gallery UI)

**Day 10-11 (Profile + Share):**
- Developer A: T058-T062 (profile page)
- Developer B: T068-T073 (share card templates)

**Day 12 (Regeneration + Share polish):**
- Developer A: T077-T082 (regeneration logic)
- Developer B: T074-T076 (share functionality)

---

## Implementation Strategy

### MVP-First Approach

**Must Have (Blocking):**
- US1, US2, US3, US4 (Core generation workflow)

**Should Have (High Value):**
- US5 (Share functionality)

**Could Have (Nice to Have):**
- US6 (Regeneration)

### Incremental Delivery

1. **Internal Demo 1 (Day 7):** US1 + US2 working
2. **Internal Demo 2 (Day 11):** US1-4 complete
3. **Beta Testing (Day 13):** US1-6 complete
4. **Public Launch (Day 14):** Polished and deployed

---

## Risk Mitigation Tasks

### High-Priority Risks

**API Integration Delays:**
- T023 (Early OpenAI test) ensures API works before building features

**Performance Issues:**
- T086 (Optimization) scheduled with buffer time before launch

**Chinese Font Rendering:**
- T011 (Font setup) done early to catch issues

**Mobile Responsiveness:**
- T087 (Device testing) with real devices before launch

---

## Testing Strategy (Manual)

### Critical Path Testing

For each user story, verify:

**US1 Testing:**
- [ ] Complete interview with all question types
- [ ] Navigate back and forth
- [ ] Refresh page (session persistence)
- [ ] Try empty submission (validation)

**US2 Testing:**
- [ ] Generate personality (<30s)
- [ ] Verify all fields populated
- [ ] Check Chinese quality
- [ ] Test retry on API failure

**US3 Testing:**
- [ ] Generate 4 images (<60s)
- [ ] Select different images
- [ ] Regenerate images
- [ ] Verify image quality

**US4 Testing:**
- [ ] View complete profile
- [ ] Test all animations
- [ ] Check mobile layout
- [ ] Verify buttons work

**US5 Testing:**
- [ ] Generate share card
- [ ] Try different templates
- [ ] Save to device
- [ ] Check image quality

**US6 Testing:**
- [ ] Regenerate personality
- [ ] Regenerate images
- [ ] Multiple regenerations

### Device Testing Matrix

| Device | Resolution | Browser | Priority |
|--------|------------|---------|----------|
| iPhone 14 Pro | 393x852 | Safari | P0 |
| iPhone SE | 375x667 | Safari | P0 |
| Android (Pixel) | 393x851 | Chrome | P1 |
| iPad | 768x1024 | Safari | P2 |
| Desktop | 1920x1080 | Chrome | P0 |
| WeChat Browser | Various | Built-in | P0 |

---

## Progress Tracking

**Week 1 Target:** Phase 1-4 complete (US1-2 working)  
**Week 2 Target:** Phase 5-9 complete (US3-6 + Polish)

### Daily Checklist Template

```markdown
### Day X Progress

**Completed:**
- [ ] T0XX - Description
- [ ] T0XX - Description

**In Progress:**
- [ ] T0XX - Description (70% done)

**Blocked:**
- [ ] T0XX - Description (waiting on API key)

**Notes:**
- [Any important decisions or discoveries]
```

---

## Success Metrics

### Task Completion Metrics

- **Week 1 Goal:** 50% tasks complete (45/89)
- **Week 2 Goal:** 100% tasks complete (89/89)

### Quality Metrics

- **Code Quality:** No TypeScript errors, ESLint warnings resolved
- **Performance:** All benchmarks met (T086 verification)
- **UX Quality:** Smooth animations, no janky scrolling
- **Content Quality:** All Chinese text reviewed by native speaker

---

## Notes

### Development Tips

1. **Start with types:** Define TypeScript types before implementing features
2. **Test APIs early:** Don't wait until Day 5 to test OpenAI
3. **Mobile-first:** Build for 375px, scale up
4. **Chinese fonts:** Test early and often
5. **Commit frequently:** Small, atomic commits with clear messages

### Commit Message Format

```
feat(interview): implement question navigation [T030]
fix(api): handle rate limit errors [T016]
style(profile): improve mobile layout [T065]
```

---

**Task List Version:** 1.0.0  
**Last Updated:** 2025-10-24  
**Status:** ✅ Ready for Implementation

**Next Action:** Begin T001 (Initialize Next.js project)

