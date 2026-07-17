# Odyssey V1 — Product Specification

> **Product promise:** Turn a meaningful goal into a clear daily plan, prove the work, and make real progress feel like an adventure.
>
> **Release:** MVP / V1
>
> **Platform:** Mobile-first application for iOS and Android
>
> **Companion sources:** [`DESIGN.md`](./DESIGN.md) owns visual language, component treatment, motion, accessibility presentation, and responsive behavior. [`TECHNICAL_STACK.md`](./TECHNICAL_STACK.md) owns implementation architecture, device-local storage, libraries, builds, and engineering gates. This document owns product behavior, scope, rules, entities, and release requirements.
>
> **Last updated:** 17 July 2026

---

## 1. Executive Summary

Odyssey is a first-party calendar and habit system with a focused game layer. It is built around a simple truth: checking a box does not show how much effort happened, whether the effort was sustained, or whether it moved a meaningful goal forward.

Odyssey therefore measures three separate things:

1. **Priority** — how important the work is to the user's main goal.
2. **Consistency** — how reliably the user shows up when the work is scheduled.
3. **Intensity** — how much of the planned effort the user actually completes.

The user chooses one active **Final Boss**, breaks it into milestones, schedules recurring habits and one-off tasks as **Quests**, completes them with honest effort data, and can attach a private photo as proof. The game rewards follow-through and recovery; it does not punish rest, encourage unsafe overwork, or turn every action into noisy points.

Odyssey V1 is not a Google Calendar skin, a social network, an AI coach, or a collection of integrations. It is a complete first-party planning and follow-through loop.

### One-sentence pitch

**A beautiful calendar adventure where every scheduled habit becomes a quest and every honest effort moves you closer to defeating your Final Boss.**

### V1 outcome

A new user must be able to:

- define one meaningful goal;
- break it into milestones;
- create and schedule habits or tasks with priorities and measurable intensity;
- see exactly what matters today;
- receive respectful deadline reminders;
- log actual effort and private photo proof;
- understand consistency and intensity separately;
- recover from a missed day without losing the whole journey; and
- defeat the Final Boss by completing its real milestones.

---

## 2. Problem and Opportunity

### 2.1 User problem

Most calendar and habit products answer only one question: **Did it happen?** A checkbox treats ten minutes and ninety minutes as the same result. A streak treats a planned rest day and an abandoned habit as the same gap. A long task list rewards easy activity while important work remains buried.

Users need a system that helps them:

- decide what matters before the day gets noisy;
- plan an effort level that is realistic;
- follow through at the right time;
- capture what actually happened;
- see whether their effort is becoming sustainable; and
- connect ordinary days to a goal they care about.

### 2.2 Product opportunity

Odyssey combines the temporal clarity of a calendar, the repeatability of a habit tracker, and the motivation of a game without letting any one layer overwhelm the others.

The differentiator is not “more gamification.” It is a better model of progress:

```text
meaningful goal → milestones → scheduled effort → honest proof → visible progress → reflection → next effort
```

### 2.3 Jobs to be done

- **When I have a long-term goal**, help me turn it into specific work I can do this week.
- **When the day begins**, show me the few commitments that matter most.
- **When a quest is due**, remind me without nagging or exposing private details.
- **When I finish**, let me record how much I actually did, not only tap a checkbox.
- **When I fall short**, help me recover without shame or a fake streak repair.
- **When I review progress**, show whether I am consistent, appropriately challenged, and moving toward the real outcome.

---

## 3. Product Audience

### 3.1 Primary users

Odyssey V1 is for students, early-career professionals, creators, and self-directed learners who have one concrete goal that requires repeated effort over several weeks or months.

Representative goals:

- prepare for an examination;
- complete a portfolio;
- build a sustainable fitness routine;
- finish a book or course;
- launch a small project;
- practice a creative skill.

### 3.2 User traits

The primary user:

- understands ordinary calendar concepts;
- wants structure but dislikes rigid productivity culture;
- is motivated by visible progress and narrative meaning;
- may have previously abandoned streak-based trackers;
- needs a quick daily experience, not a planning ritual that becomes work itself.

### 3.3 Not designed for in V1

- team project management;
- manager-assigned work;
- public challenges or competitive leaderboards;
- clinical treatment or medical adherence;
- child supervision or parental monitoring;
- complex enterprise scheduling.

---

## 4. Product Principles

### 4.1 Reality is the score

Odyssey rewards work the user actually reports. It never treats app engagement, screen time, taps, or cosmetic collection as proof of life progress.

### 4.2 Show intensity and consistency separately

One combined score may summarize progress, but it must never hide the underlying measures. A user must be able to tell whether they are missing days, underestimating effort, or planning too aggressively.

### 4.3 One journey, few priorities

V1 supports one active Final Boss. The product should create focus, not become a warehouse for every ambition.

### 4.4 Recovery beats punishment

Missed work is data. Odyssey offers rescheduling, an honest missed state, and a short reflection. It does not destroy earned progress, use guilt copy, or sell artificial streak repairs.

### 4.5 Delight follows meaning

The most expressive animation and game feedback appear when a user completes meaningful work, reaches a milestone, or defeats a Final Boss. Routine navigation stays calm.

### 4.6 Private by default

Proof photos, notes, schedules, and goal details are private. The product does not create public profiles, feeds, or discoverable proof media in V1.

### 4.7 Familiar planning, distinctive finish

Calendar behavior, forms, notifications, and controls remain recognizable. Odyssey earns memorability through its world, language, feedback, and signature moments—not unusual interaction rules.

### 4.8 Rest is part of progress

Unscheduled days, planned rest, paused habits, and recovery periods do not count as failures. The product must never reward unsafe intensity or constant availability.

---

## 5. Product Vocabulary

| Product term         | Definition                                                                 | Rule                                                                               |
| -------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Final Boss**       | The user's one active long-term goal.                                      | Only one active Final Boss in V1. Archived or completed bosses remain viewable.    |
| **Milestone**        | A concrete intermediate outcome required to defeat the Final Boss.         | Milestones represent outcomes, not repeated activity.                              |
| **Quest**            | A scheduled occurrence of a habit or task.                                 | Every calendar occurrence is independently completable and reschedulable.          |
| **Habit**            | A recurring commitment with a schedule and effort target.                  | Generates Quest occurrences.                                                       |
| **Task**             | A one-off commitment with a scheduled window or deadline.                  | Generates one Quest occurrence.                                                    |
| **Target intensity** | The planned amount of effort for a Quest.                                  | Expressed in one measurable unit such as minutes, pages, repetitions, or sessions. |
| **Minimum win**      | The smallest honest effort that still counts as showing up.                | Optional; must be greater than zero and no higher than target intensity.           |
| **Actual intensity** | The effort the user reports after attempting a Quest.                      | Uses the same unit as the target.                                                  |
| **Priority**         | Low, Medium, High, or Critical importance.                                 | Controls emphasis and ordering, not permission to interrupt without limit.         |
| **Proof**            | A private photo attached to a completion record.                           | Never public or analyzed automatically in V1.                                      |
| **Momentum**         | A transparent weekly summary of consistency and target attainment.         | Always displayed with its component measures.                                      |
| **XP**               | A game reward earned from meaningful Quest effort.                         | Cannot defeat a Final Boss by itself.                                              |
| **Voyage**           | The full history of one Final Boss from creation to completion or archive. | Remains available as a read-only history after completion.                         |

Use these terms consistently in requirements and implementation. UI copy may pair the themed term with familiar language during onboarding, for example “Quest (scheduled habit).”

---

## 6. Scope and Assumptions

### 6.1 V1 assumptions

- Odyssey is a personal, single-player experience.
- Odyssey V1 stores all product data locally on one device. It has no backend, remote account, cloud database, or sync service.
- The application owns its calendar data; no external calendar sync is required.
- A user may create many habits and tasks but may have only one active Final Boss.
- Habits may recur daily or on selected weekdays in V1.
- Each Quest has zero or one intensity unit.
- Photos are stored as private files in the application sandbox, with metadata and relative file references stored in the local database.
- Completion proof is based on user honesty. There is no AI, third-party, or human moderation of proof.
- V1 has no registration, sign-in, password, session, or remote identity. First launch creates a device-local profile.
- Notifications require explicit permission and remain configurable.

### 6.2 Hard scope boundary: no integration/provider features

V1 and the backlog in this document exclude:

- Google, Apple, Outlook, or other calendar sync;
- wearable or health-platform data;
- cloud-drive photo import;
- backend, cloud database, remote account, remote sync, or online photo storage;
- social sign-in or remote authentication;
- messaging, social network, or accountability-partner integrations;
- AI-generated schedules, coaching, or proof evaluation;
- third-party reward, commerce, or marketplace systems.

Platform capabilities such as the camera, photo picker, local notifications, haptics, and secure storage are normal application capabilities, not user-facing provider integrations.

---

## 7. Core Product Loop

### 7.1 The loop

1. **Choose the destination** — define the Final Boss and why it matters.
2. **Chart the route** — create milestones, habits, and tasks.
3. **Plan the effort** — assign time, deadline, priority, target intensity, and optional minimum win.
4. **Do the Quest** — start from Today or Calendar.
5. **Record reality** — log actual intensity, status, and optional or required proof.
6. **See progress** — receive XP, update the weekly measures, and advance milestone state where appropriate.
7. **Close the day** — review wins, misses, and tomorrow's load.

### 7.2 State model for a Quest occurrence

```text
scheduled → in progress → completed
                   ↘ partial
scheduled → rescheduled
scheduled → skipped
scheduled → overdue → completed | partial | rescheduled | missed
```

Rules:

- An overdue Quest is still recoverable.
- “Missed” is assigned at the end of the user's day only if the user has not completed, partially completed, skipped, or rescheduled it.
- A planned rest day generates no Quest and cannot become missed.
- Rescheduling moves the same occurrence and preserves its history; it does not create a fake completion.
- A user may undo a completion during a short confirmation window and may edit it later from history with an audit timestamp.

---

## 8. Information Architecture

### 8.1 Primary destinations

| Destination  | Purpose                                                                            | Primary action                     |
| ------------ | ---------------------------------------------------------------------------------- | ---------------------------------- |
| **Today**    | A calm, priority-ordered daily Quest board.                                        | Begin the next meaningful Quest.   |
| **Calendar** | Day, week, and month planning across time.                                         | Schedule or move a Quest.          |
| **Odyssey**  | Final Boss, milestones, Momentum, and voyage progress.                             | Review or advance the journey.     |
| **Me**       | Proof journal, completed voyages, preferences, privacy, and notification controls. | Review history or change settings. |

The floating bottom navigation treatment is defined in `DESIGN.md`.

### 8.2 Key screens and sheets

- First-run onboarding
- Create Final Boss
- Create or edit Habit
- Create or edit Task
- Today Quest Board
- Calendar day/week/month
- Quest Detail
- Log Completion
- Photo Proof Preview
- Odyssey Progress
- Milestone Detail
- End-of-Day Reflection
- Proof Journal
- Notification Settings
- Privacy and Data Settings

### 8.3 Global creation

A single persistent Create action offers **Habit** and **Task**. Creating a Final Boss is available only when no active one exists or after the current boss is completed or archived.

---

## 9. MVP Feature List

| ID       | MVP feature                                         | User value                                       |
| -------- | --------------------------------------------------- | ------------------------------------------------ |
| `MVP-01` | Guided voyage setup                                 | Turns an ambition into a usable journey.         |
| `MVP-02` | Final Boss and milestones                           | Connects daily work to real outcomes.            |
| `MVP-03` | Habit and task creation with intensity              | Captures the amount of work, not only frequency. |
| `MVP-04` | First-party calendar                                | Gives habits and tasks a real place in time.     |
| `MVP-05` | Priority-based Quest organization                   | Keeps the most meaningful work visible.          |
| `MVP-06` | Today Quest Board                                   | Provides one calm daily execution surface.       |
| `MVP-07` | Deadline-based reminders                            | Helps users act before work expires.             |
| `MVP-08` | Completion, partial effort, and private photo proof | Records honest outcomes with evidence.           |
| `MVP-09` | Consistency, intensity, Momentum, and XP            | Makes progress legible without hiding reality.   |
| `MVP-10` | Milestone and Final Boss completion                 | Gives the journey a meaningful end state.        |
| `MVP-11` | Recovery and end-of-day reflection                  | Prevents one missed day from ending the voyage.  |
| `MVP-12` | Proof Journal and history                           | Preserves a private visual record of effort.     |
| `MVP-13` | Privacy, notification, and accessibility controls   | Keeps the product trustworthy and usable.        |

---

## 10. Detailed MVP Requirements

### MVP-01 — Guided Voyage Setup

**Purpose:** Get the user from first launch to a meaningful first Quest in under three minutes without forcing a long tutorial.

#### Required flow

1. Explain Odyssey in one screen: plan, do, prove, progress.
2. Ask what the user wants to achieve; create the Final Boss name.
3. Ask why the goal matters in one optional sentence.
4. Ask for a target date; allow “No fixed date.”
5. Create at least one milestone or choose “I will add milestones later.”
6. Create the first Habit or Task.
7. Request notification permission only after the first scheduled Quest and after explaining the value.
8. Land on Today with the first Quest visible.

#### Rules

- All onboarding steps except Final Boss name and first Quest are skippable.
- The user can exit onboarding and resume without losing entered data.
- Do not request camera or photo-library permission during onboarding.
- Example content must be tailored to the chosen goal category but must not silently create habits.
- A clear “Use plain language” preference changes themed labels to familiar equivalents while preserving the product model.

#### Acceptance criteria

- A user can create a Final Boss and scheduled Quest without reading a tutorial.
- Back navigation preserves entered values.
- Permission denial does not block product use.
- Screen-reader order and enlarged text remain usable throughout the flow.

---

### MVP-02 — Final Boss and Milestones

**Purpose:** Make the long-term outcome explicit and separate it from the repeated work used to achieve it.

#### Final Boss fields

- Name, required, 3–80 characters.
- Motivation note, optional, up to 280 characters.
- Target date, optional.
- Cover color or one of the approved Odyssey objects, optional.
- Status: Draft, Active, Defeated, or Archived.

#### Milestone fields

- Name, required, 3–80 characters.
- Optional target date.
- Optional note.
- Order.
- Status: Not Started, In Progress, Complete.

#### Rules

- Only one Final Boss may be Active.
- A Final Boss may contain 0–12 milestones in V1.
- Milestones can be reordered through drag and through accessible Move Up/Move Down controls.
- The user marks a milestone complete manually. Quest completion can suggest that a milestone may be ready, but cannot complete it automatically.
- Defeating a Final Boss requires all milestones to be complete. If there are no milestones, the user confirms the real-world outcome directly.
- Archiving does not delete history, proof, XP, or completion records.
- Target-date changes are recorded but never framed as failure.

#### Acceptance criteria

- Daily activity never defeats a Final Boss through XP alone.
- A user can see which Habits and Tasks support each milestone.
- A user cannot accidentally activate a second Final Boss.

---

### MVP-03 — Habit and Task Creation with Intensity

**Purpose:** Represent recurring and one-off work with a realistic amount of effort.

#### Shared fields

- Title, required, 1–100 characters.
- Link to Final Boss, optional but recommended.
- Link to one milestone, optional.
- Priority: Low, Medium, High, or Critical; default Medium.
- Scheduled start time, optional for all-day items.
- Deadline or end time, optional.
- Target intensity value, optional positive number.
- Intensity unit: Minutes, Hours, Pages, Repetitions, Items, Kilometres, or Sessions.
- Minimum win value, optional.
- Proof rule: Not Needed, Optional, or Required.
- Notes, optional, up to 1,000 characters.

#### Habit-only fields

- Recurrence: Daily or selected weekdays.
- Start date.
- Optional end date.

#### Task-only fields

- Date.
- Optional completion deadline.

#### Rules

- If a target intensity exists, actual intensity uses the same unit.
- Minimum win must be greater than zero and less than or equal to target intensity.
- A deadline cannot be earlier than the scheduled start.
- A Habit edit offers: this occurrence, this and future occurrences, or the entire series where applicable.
- Existing historical occurrences never change when future schedule or intensity settings change.
- Critical priority requires an extra confirmation explaining that it should be rare. It does not grant unlimited notifications.
- The creation form shows the estimated load added to that day.

#### Example

```text
Habit: Study mathematics
Schedule: Monday–Friday, 6:30 PM
Target intensity: 60 minutes
Minimum win: 20 minutes
Priority: High
Proof: Optional
Linked milestone: Finish algebra syllabus
```

#### Acceptance criteria

- A user can create a measurable Quest in under 45 seconds.
- A user can create an unmeasured checklist-style Quest by omitting intensity.
- Recurrence edits do not rewrite past records.
- Invalid time and intensity combinations provide inline recovery guidance.

---

### MVP-04 — First-Party Calendar

**Purpose:** Make scheduled habits and tasks visible, editable, and trustworthy across time.

#### Views

- **Day:** time-ordered schedule plus all-day Quests.
- **Week:** seven-day overview with time placement and load indication.
- **Month:** completion state and daily load summary; selecting a day opens its agenda.

#### Behavior

- Habits and tasks share one calendar but retain distinct icons and accessible labels.
- Priority is never conveyed by color alone.
- Tap opens Quest Detail.
- Long press or explicit Move action reschedules a Quest.
- Dragging has an equivalent non-drag interaction.
- A move previews conflicts and daily planned intensity before confirmation.
- Overlapping Quests remain individually readable.
- Time-zone changes preserve the user's intent: timed items follow local wall time by default; a settings choice may preserve absolute time.
- Daylight-saving transitions cannot duplicate or silently remove occurrences.

#### States

- Scheduled
- In Progress
- Complete
- Partial
- Rescheduled
- Skipped
- Overdue
- Missed

#### Acceptance criteria

- Calendar state matches Today and Odyssey history after refresh and relaunch.
- Users can create, edit, move, and complete a Quest without external calendar access.
- Month view remains legible without showing every Quest title.
- All drag behavior has a single-pointer or button alternative.

---

### MVP-05 — Priority-Based Quest Organization

**Purpose:** Put meaningful work ahead of easy work.

#### Priority model

| Priority | Meaning                                            | Default base XP | Visual treatment |
| -------- | -------------------------------------------------- | --------------: | ---------------- |
| Low      | Useful but deferrable.                             |              10 | Quiet            |
| Medium   | Normal planned work.                               |              15 | Standard         |
| High     | Directly advances the current goal.                |              25 | Strong           |
| Critical | Time-sensitive and materially consequential today. |              40 | Urgent but calm  |

#### Default Today ordering

1. In Progress.
2. Critical, then High, Medium, and Low.
3. Within a priority: earliest deadline first.
4. Items without deadlines: scheduled start first.
5. Remaining ties: user-defined order.

#### Rules

- Users may manually reorder Today; the custom order lasts for that day.
- Overdue state does not automatically promote a Low item above a current Critical item.
- The board labels why an item is surfaced, for example “High priority · due 8:00 PM.”
- The product warns when more than three Critical Quests are scheduled in one day but does not block saving.
- Priority affects emphasis and XP, not the truth of completion or Final Boss progress.
- Editing priority later does not rewrite previously earned XP.

#### Acceptance criteria

- The highest-impact Quest is visible without scrolling in the standard Today state.
- Priority remains understandable in grayscale and to screen readers.
- Manual ordering is preserved through app relaunch for the current day.

---

### MVP-06 — Today Quest Board

**Purpose:** Give the user a calm daily command center with one obvious next action.

#### Required content

- Date and a short contextual greeting.
- A compact Final Boss progress cue.
- The next recommended Quest with one primary **Begin** action.
- Remaining Quests grouped as Now, Later, and Done.
- Planned intensity for the day.
- An overload warning when scheduled target time exceeds a user-set or inferred daily capacity; this is advisory only.
- End Day action available in the evening or after all Quests have a final state.

#### Begin behavior

- Marks the Quest In Progress and records a start timestamp.
- Shows title, target intensity, minimum win, deadline, notes, and proof rule.
- Provides Finish, Pause, and Leave Quest actions.
- V1 does not require a running focus timer; elapsed time may be shown only from the recorded start as context.

#### Empty and complete states

- Empty day: offer Create Quest and view the next scheduled day.
- All complete: show a restrained celebration and invite End Day.
- Rest day: explicitly acknowledge planned rest without implying lost progress.

#### Acceptance criteria

- The surface presents one clear primary action.
- A user can reach Log Completion in no more than two taps from Today.
- The experience remains fully usable with environmental imagery, animation, sound, and haptics disabled.

---

### MVP-07 — Deadline-Based Reminders

**Purpose:** Deliver timely, useful prompts that help the user act without creating notification fatigue.

#### Reminder stages

| Stage    | Default trigger                          | Example                                                     | Available actions |
| -------- | ---------------------------------------- | ----------------------------------------------------------- | ----------------- |
| Prepare  | 15 minutes before a scheduled start      | “Your mathematics quest begins in 15 minutes.”              | View, Snooze      |
| Deadline | 60 minutes before an incomplete deadline | “One hour remains before this quest closes.”                | Begin, Reschedule |
| Overdue  | 15 minutes after deadline, once only     | “This quest is overdue. Finish, move, or mark it honestly.” | Log, Reschedule   |

#### Urgency rules

- Reminders are enabled per Habit or Task and can be changed per occurrence.
- Default maximum is two pre-deadline notifications and one overdue notification per Quest per day.
- Low-priority Quests default to one reminder; Critical can default to two but still respects the maximum.
- If the Quest is completed, skipped, or rescheduled, all obsolete reminders are cancelled.
- Quiet hours delay non-critical reminders until the next allowed time and state that delivery was delayed.
- Odyssey does not use operating-system critical-alert privileges in V1.
- Foreground reminders appear as a subtle in-app update, not a duplicate system banner.
- Notification bodies hide goal names and notes when Privacy Preview is enabled.

#### Copy rules

- State what changed or what time remains.
- Do not shame, threaten, or imply that the user has failed before the deadline.
- Do not claim a boss is “recovering” unless that is a clearly defined visual metaphor with no misleading progress consequence.
- Keep the title and body understandable without game vocabulary.
- Never expose proof-photo details, private notes, or sensitive goal names on a lock screen.

#### Acceptance criteria

- Notification permission is requested contextually, not on first launch.
- No reminder is delivered after its Quest reaches a terminal state.
- Snooze and reschedule preserve the original occurrence history.
- A user can disable all reminders in one place.

---

### MVP-08 — Completion, Partial Effort, and Private Photo Proof

**Purpose:** Capture what actually happened with enough evidence to feel real, while keeping the interaction fast and private.

#### Completion flow

1. Choose outcome: Complete, Partial, Skip, or Reschedule.
2. Enter actual intensity when the Quest has a target.
3. Capture or choose one photo when proof is Optional or Required.
4. Add an optional note of up to 500 characters.
5. Review the result and save.

#### Status rules

- **Complete:** Actual intensity meets or exceeds target, or the user confirms completion for an unmeasured Quest.
- **Partial:** Actual intensity is above zero but below target, including a minimum win.
- **Skip:** The user deliberately chooses not to attempt the Quest. Optional reason.
- **Missed:** The end-of-day process finds no user-selected outcome.
- **Rescheduled:** The occurrence moves to a new time or date and is not counted as complete.
- If proof is Required, Complete or Partial cannot be saved until a proof image is attached. The user can instead reschedule or skip.

#### Proof behavior

- One image per completion in MVP.
- Camera and photo-library access are requested only when the user chooses the corresponding action.
- A preview appears before the image is saved into Odyssey's private local storage.
- Location metadata is removed by default.
- The original capture time may be stored privately for ordering but is not presented as third-party verification.
- Local processing and save progress, retry, and cancellation are visible.
- A failed proof-file save cannot produce a proof-backed completion.
- Proof is never awarded extra XP when it is optional; privacy should not be traded for points.
- No facial recognition, object recognition, AI review, or public moderation.

#### Editing and integrity

- Users may edit actual intensity, note, or proof later.
- The completion record retains `created_at` and `updated_at` timestamps.
- XP and aggregate measures recalculate after an edit.
- Deleted proof is removed from the journal and permanently removed from local storage, including its thumbnail.

#### Acceptance criteria

- Logging an unmeasured completion takes no more than three deliberate actions.
- Offline completion saves locally because the product has no network dependency.
- Required proof cannot be bypassed by a failed or cancelled local save.
- Proof remains inside the private application sandbox unless the user explicitly exports it.

---

### MVP-09 — Consistency, Intensity, Momentum, and XP

**Purpose:** Make progress informative and motivating without collapsing it into a deceptive score.

#### Consistency

Consistency answers: **How often did I show up as planned?**

For a selected period:

```text
consistency = showed-up occurrences / due occurrences × 100
```

- Complete and Partial count as showed up.
- Skipped and Missed count as not showed up.
- Rescheduled occurrences count only on the destination date after their due state is resolved.
- Future, paused, archived, and planned-rest occurrences are excluded.

#### Intensity attainment

Intensity answers: **How much of the planned effort did I deliver?**

For measured Quests:

```text
occurrence attainment = min(actual intensity / target intensity, 1.0)
period intensity = average occurrence attainment × 100
```

- Values above target may be displayed as actual effort but do not increase rewards beyond 100%.
- Unmeasured Quests are excluded from intensity attainment and remain represented in consistency.
- Skipped and Missed measured occurrences contribute 0% when due.

#### Momentum

Momentum is a weekly summary, not a currency:

```text
momentum = 60% consistency + 40% intensity attainment
```

- If there are no measured Quests, Momentum equals consistency and the UI explains why.
- The interface always displays Consistency and Intensity next to Momentum.
- Priority does not distort these truth metrics.
- Momentum is shown as Building, Steady, or Strong rather than a moral grade.

#### XP

XP provides immediate game feedback:

```text
earned XP = priority base XP × effort factor
effort factor = 1.0 for an unmeasured completion
effort factor = min(actual / target, 1.0) for a measured Quest
```

- Partial effort earns proportional XP.
- Skipped, Missed, and Rescheduled states earn zero XP.
- Optional proof does not change XP.
- XP is stored in an append-only ledger so recalculation and correction are explainable.
- XP unlocks voyage levels and visual recognition only. It cannot mark milestones complete or defeat a Final Boss.

#### Presentation

- Show 7-day and 30-day views.
- Show actual versus target in the user's chosen unit.
- A heatmap may show state but never rely on color alone.
- Explain every formula in a Learn How Progress Works sheet.

#### Acceptance criteria

- The same history always produces the same measures.
- A user can inspect which occurrences affected a metric.
- Editing or deleting a completion recalculates aggregates and XP.
- Over-target effort never creates an incentive for unsafe intensity.

---

### MVP-10 — Milestone and Final Boss Completion

**Purpose:** Make winning correspond to a real result, not arbitrary app activity.

#### Milestone completion

- The user opens a milestone, reviews linked activity, and confirms the outcome is complete.
- An optional note and proof image may be attached.
- Completion records the timestamp and freezes a snapshot of its title and note for voyage history.
- A completed milestone can be reopened after confirmation; the Final Boss returns to Active if necessary.

#### Final Boss defeat

- Available when every milestone is complete, or when the no-milestone confirmation flow is used.
- Shows the voyage period, completed Quests, total honest effort, consistency, intensity, proof highlights, and the user's original motivation.
- Asks one reflection: “What changed because you completed this?”
- Plays the signature victory moment defined by `DESIGN.md`, with reduced-motion, no-sound, and no-haptic equivalents.
- Archives the Voyage as Defeated.
- Offers Create Next Voyage and Return to History. It does not force immediate goal creation.

#### Acceptance criteria

- Final Boss defeat requires explicit user confirmation of the outcome.
- A user can view all contributing records after defeat.
- Celebration never blocks access to the app or requires rapid interaction.

---

### MVP-11 — Recovery and End-of-Day Reflection

**Purpose:** Turn a difficult day into useful planning data instead of a broken streak.

#### End Day flow

- Summarize Complete, Partial, Rescheduled, Skipped, and unresolved Quests.
- Ask the user to resolve unresolved Quests: reschedule, skip, or leave missed.
- Offer one optional reflection prompt: “What made today easier or harder?”
- Ask whether tomorrow's load still looks realistic.
- Save in under 30 seconds.

#### Recovery behavior

- After a missed Quest, offer: Try Next Scheduled Time, Reschedule Once, Reduce Future Target, or Pause Habit.
- Suggest reducing a target only after repeated shortfall; never change it automatically.
- Preserve the original plan and completion history.
- A minimum win counts as Partial and showing up, not as full target attainment.
- No streak-loss modal, guilt language, red failure screen, or paid repair mechanic.

#### Acceptance criteria

- A user can finish the day without fabricating completion.
- Rescheduling does not duplicate a Quest.
- Changes to future targets do not alter past attainment.
- The reflection flow is optional and dismissible.

---

### MVP-12 — Proof Journal and History

**Purpose:** Give the user a private, emotionally resonant record of the work behind the result.

#### Journal behavior

- Chronological feed of completion records.
- Filters: All, Complete, Partial, Milestones, and With Proof.
- Each entry shows Quest title, date, actual versus target, state, note excerpt, and proof thumbnail when present.
- Selecting proof opens a private full-screen preview with date, linked Quest, edit, and delete actions.
- The user can navigate from an entry to its day, Habit, milestone, or Voyage.
- A text-only list is available when images are hidden or reduced media detail is enabled.

#### Privacy behavior

- Proof thumbnails are obscured in the app switcher when Privacy Shield is on.
- Sensitive previews can be hidden until tapped.
- Deleted Habits do not orphan completion history; the historical title snapshot remains.

#### Acceptance criteria

- Journal order remains stable across time-zone changes.
- Image failure has meaningful alt text derived from user-entered context, not image analysis.
- Delete clearly distinguishes removing one proof from deleting the entire completion record.

---

### MVP-13 — Privacy, Notification, and Accessibility Controls

**Purpose:** Make control over reminders, media, motion, and personal data a first-class product feature.

#### Settings

- Notification master switch.
- Per-priority reminder defaults.
- Quiet hours.
- Lock-screen Privacy Preview.
- Theme: Light, System, and any alternate theme approved by `DESIGN.md`.
- Reduced Motion follows the operating system by default and can be made stricter in-app.
- Sound and haptics controls.
- Plain Language terminology.
- Privacy Shield for proof and app-switcher previews.
- Export My Data.
- Erase All Local Data with explicit confirmation and a clear warning that the action cannot be recovered without a user-created export.

#### Accessibility requirements

- Meet WCAG 2.2 AA where applicable; target AAA guidance for visible focus treatment.
- Minimum 44 × 44 pt/dp touch targets for primary controls, exceeding the WCAG 2.2 24 × 24 CSS px minimum for pointer targets.
- Every drag interaction has a non-drag alternative.
- Color is never the only state or priority signal.
- Dynamic text does not hide actions or force horizontal scrolling.
- Screen readers announce Quest status, priority, target, deadline, and available actions in a sensible order.
- Proof is never required to understand a completion record; user text and structured metadata provide an equivalent.
- Motion, haptics, sound, blur, imagery, and environmental effects all have usable fallbacks.

#### Acceptance criteria

- Denying camera, photo, or notification permission leaves all unrelated features usable.
- All preferences persist across relaunch.
- Data export includes goals, milestones, schedule, completion data, notes, and links to proof media in a documented format.
- Erase All Local Data removes the database, proof originals, thumbnails, temporary files, exports, scheduled reminders, and local encryption key.

---

## 11. Signature Experience Moments

These moments define award-caliber product character without changing the functional rules.

### 11.1 Sunrise Brief

The first open of the day reveals the single highest-priority Quest, today's planned intensity, and the Final Boss on the horizon. Supporting Quests appear only after the primary commitment is understood. The experience should take seconds, not become a dashboard inspection ritual.

### 11.2 Proof Becomes a Postcard

After a completion is saved, its proof image settles into a postcard-like memory card using the visual treatment in `DESIGN.md`. Actual effort and the user's note remain the hero; decoration never obscures the evidence.

### 11.3 The Horizon Moves

Meaningful progress subtly changes the environment—light, distance, or island detail—while textual progress remains explicit. Environmental change is never the sole status signal.

### 11.4 Final Boss Victory

The completed Voyage compresses months of ordinary effort into a short, emotionally clear sequence: original motivation, days shown up, effort delivered, milestones crossed, proof memories, and final reflection. It celebrates the real outcome, then becomes still.

### 11.5 Quiet Rest Day

A planned rest day has its own beautiful state with no empty-task anxiety. It confirms that rest is part of the route and previews the next Quest without asking the user to fill the space.

---

## 12. Detailed User Flows

### 12.1 Create and schedule a Habit

```text
Create → Habit
→ enter title
→ choose recurrence
→ choose start/deadline
→ choose target intensity and optional minimum win
→ choose priority
→ choose proof rule
→ link Final Boss/milestone
→ review daily load
→ save
→ occurrence appears in Today and Calendar
```

### 12.2 Complete with proof

```text
Today → Begin Quest → Finish
→ enter actual intensity
→ choose Complete or Partial from calculated result
→ capture/select proof
→ preview and confirm
→ process/save locally
→ XP feedback
→ updated consistency and intensity
→ return to Today
```

### 12.3 Recover an overdue Quest

```text
Reminder or Today → overdue Quest
→ Log now | Reschedule | Skip
→ if Log: actual effort + proof rules
→ if Reschedule: choose valid future slot and review load
→ if Skip: optional reason
→ state and metrics update honestly
```

### 12.4 Defeat the Final Boss

```text
Odyssey → all milestones complete
→ Review Voyage
→ confirm outcome achieved
→ optional final proof and reflection
→ victory moment
→ Voyage archived as Defeated
→ next action: rest or create another Voyage
```

---

## 13. Content and Notification Language

### 13.1 Voice

- Brave, warm, and direct.
- Short sentences and concrete verbs.
- Game language supports comprehension; it never replaces it.
- The user is the actor. Odyssey is the map, not a scolding coach.
- Avoid hustle culture, moral judgment, fake urgency, and childish fantasy copy.

### 13.2 Preferred patterns

| Situation | Preferred                                                          | Avoid                                       |
| --------- | ------------------------------------------------------------------ | ------------------------------------------- |
| Upcoming  | “Study mathematics begins in 15 minutes.”                          | “Your destiny awaits!!!”                    |
| Deadline  | “One hour remains. Begin or move this quest.”                      | “The boss is healing because you are late.” |
| Partial   | “You showed up for 25 of 60 minutes.”                              | “Quest failed.”                             |
| Missed    | “This one was missed. Adjust the plan or try the next occurrence.” | “You broke your streak.”                    |
| Rest      | “Rest is on the route today.”                                      | “No productivity recorded.”                 |
| Victory   | “You did the work. The goal is complete.”                          | “You won 5,000 coins!”                      |

### 13.3 Familiar-language pairing

During onboarding and in accessibility settings, themed terms pair with familiar language:

- Final Boss · Main Goal
- Quest · Scheduled Habit or Task
- Voyage · Goal Journey
- Proof · Completion Photo

---

## 14. Data Model

This is a product-level model, not a storage implementation mandate.

### 14.1 Core entities

| Entity          | Required relationships                           | Important properties                                                                      |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| LocalProfile    | Owns all other entities on the device.           | Locale, time zone, day boundary, preferences.                                             |
| FinalBoss       | Has many Milestones, Habits, Tasks, and Voyages. | Status, target date, motivation.                                                          |
| Milestone       | Belongs to FinalBoss.                            | Order, status, completed timestamp.                                                       |
| Habit           | Generates Occurrences.                           | Recurrence, priority, intensity definition, proof rule.                                   |
| Task            | Generates one Occurrence.                        | Date, deadline, priority, intensity definition, proof rule.                               |
| Occurrence      | Belongs to Habit or Task.                        | Planned time, deadline, state, schedule snapshot.                                         |
| Completion      | Belongs to Occurrence.                           | Actual intensity, result, note, timestamps.                                               |
| ProofAsset      | Belongs to Completion or Milestone completion.   | Private relative file path, thumbnail path, media type, size, checksum, local-save state. |
| Reminder        | Belongs to Occurrence.                           | Trigger, stage, delivery state, cancellation reason.                                      |
| XPLedgerEntry   | Belongs to Completion.                           | Base, factor, delta, calculation version.                                                 |
| DailyReflection | Belongs to LocalProfile and local date.          | Optional text, load decision.                                                             |
| Voyage          | Snapshot of a completed or archived FinalBoss.   | Summary measures, reflection, final state.                                                |

### 14.2 Historical integrity

- Occurrences snapshot title, priority, target intensity, unit, proof rule, and linked milestone at generation or due time.
- Changing a Habit updates future occurrences only unless the user selects a broader edit scope.
- Completion edits recalculate metrics through versioned, deterministic rules.
- Deleting a source Habit or Task preserves minimum historical snapshots needed for Journal and Voyage review.

---

## 15. Local Persistence and Time Behavior

### 15.1 Offline-by-default actions

The full V1 product must work without internet access from first launch:

- view Today and Calendar from the local database;
- begin a Quest;
- record Complete, Partial, Skip, or Reschedule;
- enter actual intensity and a note;
- capture and save proof into private local storage;
- view complete local history.

### 15.2 Local durability rules

- User actions are never discarded silently.
- Multi-record product actions use atomic local database transactions.
- Required proof is saved to a verified private file before its completion metadata commits.
- A local save failure keeps the user on a recoverable error state with their entered values preserved.
- Completion state and XP remain pending only until the related local transaction is durable; celebration cannot precede that result.
- Force-close and relaunch must restore every committed action without a sync or recovery service.

### 15.3 Time rules

- Every occurrence stores local date, local time, time zone, and absolute timestamps where relevant.
- The user can set a custom day boundary for late-night schedules.
- Crossing midnight during a Quest does not move its identity to a different occurrence.
- Time-zone changes prompt the user once to choose whether future timed Quests follow local wall time or retain absolute time.

---

## 16. Privacy and Safety Requirements

### 16.1 Data minimization

- Collect only the local profile, schedule, progress, settings, and user-supplied proof data needed for the product.
- Do not collect continuous location, contacts, microphone recordings, health data, or browsing behavior.
- Strip proof-photo location metadata by default.
- Do not use proof media for advertising, model training, or public content.

### 16.2 Media protection

- Proof media remains inside the operating system's private application sandbox.
- Do not create public asset URLs or network delivery paths.
- Encrypt the local structured database at rest and use platform file protection for private proof media; do not claim file-level encryption unless it is implemented and verified.
- Do not place user photo paths, notes, or goal names in logs.
- Thumbnails inherit the same access rules as originals.
- Exclude the local database and proof directory from automatic operating-system cloud backup.
- User-triggered export is the only V1 backup path.

### 16.3 Behavioral safety

- Do not reward exceeding target intensity.
- Allow users to pause, lower, or remove targets without penalty.
- Include copy making clear that Odyssey is not medical advice.
- Do not rank users, compare productivity, or use loss-aversion purchases.
- Critical priority does not bypass quiet hours or platform safety rules.

---

## 17. Product Quality and “Award-Winning” Standard

An award-caliber Odyssey release is not simply visually impressive. It must combine originality, usability, accessibility, content clarity, and excellent mobile performance.

### 17.1 Experience bar

- One memorable visual moment per surface, never a wall of effects.
- The primary action is obvious within two seconds.
- No important action depends on discovering a gesture.
- Calendar movement and Quest completion feel immediate.
- Empty, error, partial, overdue, offline, and rest states receive the same design care as success.
- The interface remains coherent with images hidden, motion reduced, haptics off, and large text enabled.
- Visual implementation follows `DESIGN.md` exactly rather than inventing feature-specific styles.

### 17.2 Performance bar

The specific UI budgets in `DESIGN.md` are binding. Product-critical additions also require:

- Today becomes usable from warm launch without waiting for proof thumbnails.
- Calendar scrolling and state changes target 60 FPS on the agreed device range.
- Proof processing and local file writes never block completion-note entry; final save waits honestly for required proof durability.
- Environmental media and thumbnails are progressively loaded and never outrank primary content.
- Journal lists load local thumbnails instead of decoding full-resolution proof files.

### 17.3 Accessibility bar

- WCAG 2.2 AA applicable requirements are release blockers.
- Focus cannot be obscured by the floating navigation, sheets, or keyboard.
- Visible focus is high contrast and clearly sized.
- Drag scheduling has tap-based alternatives.
- Status, priority, and progress are available through text and semantics, not color or motion alone.

### 17.4 Trust bar

- Every score is explainable.
- Every notification is cancellable and privacy-aware.
- Every proof photo is deletable.
- Every missed state is honest and recoverable.
- No success message appears before a durable local save.

---

## 18. Success Metrics

### 18.1 North-star metric

**Weekly Meaningful Follow-Through (WMF):** the percentage of active users who show up for at least three goal-linked Quest occurrences in a week and log actual effort for each.

This measures repeated real-world engagement, not time spent in the app.

### 18.2 Activation

A user is activated when, within 24 hours of first launch, they:

1. create a Final Boss;
2. schedule at least two future Quest occurrences; and
3. log actual effort for at least one Quest.

### 18.3 Core product measures

- Activation rate.
- Week 1 and Week 4 retained planners.
- Percentage of due Quests with an honest terminal state.
- Median consistency and intensity attainment by week.
- Percentage of active users completing a milestone within 30 days.
- Percentage of missed users who return and show up within the next seven days.
- Median time to create a Habit.
- Median time to log a completion.

### 18.4 Quality guardrails

- Notification opt-out and permission-denial rate.
- Notifications delivered after terminal Quest state: target zero.
- Proof processing/save failure and unrecoverable-loss rate.
- Proof deletion completion rate and time.
- Crash-free sessions.
- Calendar state mismatch reports.
- Accessibility defects by severity.
- Percentage of users scheduling more than three Critical Quests per day.
- Over-target intensity frequency, monitored only in aggregate to detect harmful reward design.

### 18.5 Analytics boundaries

- V1 does not transmit product analytics, crash reports, schedules, metrics, or usage events.
- Product measures in this section are evaluated through local QA, user research, and separately approved test builds until an explicit online analytics decision is made.
- Any on-device diagnostic counters remain local, contain no proof contents or free text, and are erased with local data.
- Adding remote analytics later requires a separate consent, privacy, retention, and data-minimization specification.

---

## 19. Extra Features Backlog

The following features are deliberately outside MVP. They are ordered by product value, not by visual excitement. None requires an external integration or provider-facing product surface.

### 19.1 Primary extras — practical productivity

#### `P1-01` — Capacity Planner

Users set a realistic daily or weekly capacity in minutes or effort units. Calendar scheduling shows planned load versus capacity and identifies overloaded days before the user commits.

**Why it matters:** Priority is useful only when the total plan is possible.

**Key rules:** Advisory, never blocks scheduling; supports rest days; no automatic schedule changes.

#### `P1-02` — Flexible Habit Windows

Instead of one exact start time, a Habit may be scheduled for a window such as “morning” or “6:00–9:00 PM.” Reminders adapt within that window while the Quest remains one occurrence.

**Why it matters:** Many habits need consistency without minute-level rigidity.

#### `P1-03` — Built-In Focus Session

A calm countdown or count-up session runs inside a Quest, supports pause and resume, and proposes the captured duration as actual intensity. The user confirms before saving.

**Why it matters:** Reduces the gap between planning and doing without requiring another app.

#### `P1-04` — Routine Templates

Users can save a personal set of Habits and Tasks as a reusable routine, preview its load, and add it to a Voyage. Templates remain private and user-created.

**Why it matters:** Repeated setup should become easier after the first successful journey.

#### `P1-05` — Quest Checklists

A Quest can contain a short checklist while still having one outcome, one intensity target, and one completion record.

**Why it matters:** Supports realistic preparation without turning Odyssey into project-management software.

#### `P1-06` — Advanced Review

Weekly and monthly reviews show priority mix, planned versus actual intensity, common reschedule times, completion by time of day, and target realism.

**Why it matters:** Helps users improve the plan instead of merely judging the past.

#### `P1-07` — Recovery and Vacation Mode

Users pause selected Habits for illness, travel, exams, or recovery. The interval is excluded from due counts and preserved in history as planned pause.

**Why it matters:** Sustainable systems acknowledge real life.

#### `P1-08` — Rules-Based Rollover

Users choose a transparent rule for unresolved Quests: leave missed, ask each evening, or move once to the next open day. The product previews every move and never loops a Quest indefinitely.

**Why it matters:** Reduces manual cleanup without opaque automation.

#### `P1-09` — Local Home-Screen Widgets

Widgets show the next Quest, daily progress, or quick Log action using privacy-safe text settings.

**Why it matters:** Makes follow-through possible without opening the full world.

#### `P1-10` — Full Backup and Restore Package

Users can export and restore a complete Odyssey package containing structured data and proof media.

**Why it matters:** Personal history should not be trapped in the product.

### 19.2 Secondary extras — purposeful gamification

#### `P2-01` — Voyage Chapters

Milestone groups become chapters with distinct scenery and a short opening intention. The chapter changes only when its outcome is complete.

**Purpose:** Give long goals a readable arc without replacing real milestones.

#### `P2-02` — Boss Phases

A Final Boss visually changes at milestone thresholds. Each phase summarizes what the next real-world outcome requires.

**Purpose:** Make milestone progression dramatic while keeping victory outcome-based.

#### `P2-03` — Skill Constellations

Completed goal-linked Habits gradually reveal a private constellation of skills such as Practice, Endurance, or Craft. Users choose labels; the product does not infer personality.

**Purpose:** Reflect identity growth without a competitive leaderboard.

#### `P2-04` — Earned Island Objects

Consistent, target-aligned weeks unlock a small set of visual objects for the user's island. Objects mark memorable periods and cannot be purchased to fake progress.

**Purpose:** Turn real effort into tasteful environmental memory.

#### `P2-05` — Challenge Modifiers

Users may add a temporary, opt-in rule to a Habit, such as “three focused sessions this week” or “finish before noon twice.” Modifiers never raise required intensity automatically.

**Purpose:** Add variety after the core behavior is stable.

#### `P2-06` — Comeback Quest

After a long pause, Odyssey offers one deliberately small return Quest based on the user's saved minimum win. Completing it creates a comeback marker, not a restored streak.

**Purpose:** Celebrate re-entry instead of punishing absence.

#### `P2-07` — Personal Achievements

Achievements recognize meaningful patterns such as Honest Rescheduler, First Milestone, Balanced Week, or Returned After a Miss. No achievement rewards unsafe volume or app-open frequency.

**Purpose:** Reinforce healthy planning behavior, not point farming.

#### `P2-08` — Voyage Recap Film

The app composes a short, on-device animated recap from structured progress and user-selected proof. The user previews and exports it manually; nothing is shared automatically.

**Purpose:** Create an emotional artifact at the end of a real journey.

### 19.3 Tertiary extras — creative minimalist ideas

#### `P3-01` — One Quest Mode

Hide everything except the current Quest, its minimum win, and one Finish action. The mode ends manually or after the Quest resolves.

**Minimal value:** Removes the productivity dashboard at the moment work begins.

#### `P3-02` — Tide View

A single horizontal tide line represents today's time. Only the next commitment and the current free window are labeled; the full calendar remains one tap away.

**Minimal value:** Communicates temporal pressure without a dense grid.

#### `P3-03` — Future Postcard

At Voyage setup, the user writes a short private note from the future version of themselves who completed the goal. It returns only at a chosen milestone or Final Boss victory.

**Minimal value:** Adds narrative meaning with one piece of text and no new system.

#### `P3-04` — Sandbar

Users protect a blank buffer between difficult Quests. It is not a task and earns no XP; it simply prevents the schedule from becoming impossible.

**Minimal value:** Makes empty time an intentional design element.

#### `P3-05` — Proof Mosaic

A zoomable, label-light field of private proof images reveals the voyage through texture and time. Selecting an image restores its structured context.

**Minimal value:** Turns effort into a visual memory without social posting.

#### `P3-06` — Sunset Close

At day end, the interface asks only: “Keep tomorrow as planned?” A single Yes closes the day; No opens the full planning review.

**Minimal value:** Makes reflection available without making journaling compulsory.

#### `P3-07` — The Empty Horizon

After Final Boss victory, the home surface briefly removes all planning prompts and shows only the completed outcome and a Rest action. New-goal creation remains available but visually secondary.

**Minimal value:** Lets completion feel complete instead of immediately creating another productivity loop.

---

## 20. Explicitly Out of Scope

The following are not part of Odyssey V1 or the approved extras above:

- external calendar import, export, or bidirectional sync;
- AI coaching, automatic habit generation, or proof recognition;
- social feeds, followers, messaging, public profiles, or leaderboards;
- shared goals, teams, families, or manager views;
- monetary rewards, loot boxes, purchasable streak repair, or random paid items;
- wearable, location, health, or biometric tracking;
- public proof sharing or proof moderation;
- marketplace templates;
- complex task dependencies, Gantt charts, or enterprise project management;
- multiple simultaneous active Final Bosses;
- automatic completion inferred from device activity;
- clinical, therapeutic, or medical claims.

---

## 21. Release Priorities

### Must ship

- Complete loop from Final Boss creation through honest Quest completion.
- Day/week/month first-party calendar.
- Habit recurrence and one-off Tasks.
- Priority, deadline, target intensity, minimum win, and proof rule.
- Today ordering and overload awareness.
- Configurable reminders with cancellation and privacy behavior.
- Complete, Partial, Skip, Reschedule, Overdue, and Missed states.
- Private local proof processing, durable save, retry, and deletion.
- Deterministic consistency, intensity, Momentum, and XP.
- Milestone and Final Boss completion.
- Recovery flow, Journal, settings, accessibility, and data controls.

### Can simplify without breaking the MVP

- Month view may use state markers instead of full event labels.
- Final Boss cover may use a small curated object set rather than customization.
- Local QA instrumentation can begin with activation, terminal-state completion, and reliability counters.
- Plain Language mode can initially change the core vocabulary only.

### Must not fake

- Do not mark proof as saved before its private local file and database metadata are durable.
- Do not call XP “goal progress.”
- Do not call Partial “Complete.”
- Do not claim notification reliability without testing device delivery states.
- Do not claim photo privacy without access-control and deletion verification.
- Do not call the release accessible without keyboard/switch, screen-reader, large-text, contrast, and reduced-motion checks.

---

## 22. MVP Acceptance Journey

The MVP is product-complete only when this end-to-end journey passes on the agreed iOS and Android test devices:

1. Launch the app and create its device-local profile without registration or sign-in.
2. Create a Final Boss named “Pass the mathematics examination.”
3. Add two milestones.
4. Create a weekday Habit with 60-minute target, 20-minute minimum win, High priority, 8:00 PM deadline, and Optional proof.
5. Create a one-off Critical Task on the same day.
6. Confirm Today orders and explains both items correctly.
7. Move the Habit from Calendar using drag, then repeat using the accessible non-drag action.
8. Receive the configured reminder and act from it.
9. Record 25 minutes and one private proof photo; confirm the result is Partial.
10. Enable airplane mode, record another completion with local proof, force-close, and relaunch without data loss.
11. Confirm consistency, intensity, Momentum, and XP match the documented formulas.
12. Reschedule an overdue Quest and verify no duplicate occurrence or stale reminder remains.
13. End the day with one Complete, one Partial, and one Missed outcome.
14. Reduce a future target without changing historical metrics.
15. Complete both milestones and explicitly defeat the Final Boss.
16. Review the archived Voyage and Proof Journal.
17. Export data, delete one proof, and verify it is no longer accessible.
18. Repeat the critical path with screen reader, enlarged text, reduced motion, no haptics, denied camera access, and denied notification access.

---

## 23. Key Risks and Mitigations

| Risk                                                               | Why it matters                                         | Product mitigation                                                                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Gamification overwhelms planning                                   | The app becomes entertainment instead of a tool.       | Keep real outcomes primary; XP stays cosmetic and explanatory.                                                  |
| Users game the proof system                                        | Photos may not represent the claimed work.             | Treat proof as private self-accountability, not objective verification.                                         |
| Notifications become nagging                                       | Users disable the channel or abandon the app.          | Contextual consent, strict caps, quiet hours, cancellation, respectful copy.                                    |
| Intensity encourages overwork                                      | More can look morally better.                          | Cap attainment and XP at target; celebrate sustainable planning and rest.                                       |
| Critical becomes the default                                       | Priority loses meaning and creates anxiety.            | Explain rarity and warn above three Critical Quests per day.                                                    |
| Photo storage creates privacy exposure                             | Proof may contain faces, locations, or private spaces. | Private access, metadata stripping, preview controls, deletion, no analysis.                                    |
| Calendar or local persistence rules produce duplicate or lost work | Trust collapses quickly.                               | Immutable history, atomic writes, unique occurrence constraints, explicit edit scopes, and time-zone/DST tests. |
| Scope expands into project management                              | MVP loses its core loop.                               | One active Final Boss, simple milestones, no dependencies or collaboration.                                     |
| Visual ambition harms speed or access                              | Award-oriented effects can obstruct the product.       | Bind to `DESIGN.md` fallbacks and performance budgets; content before scenery.                                  |

---

## 24. Research Basis

The product choices above use current guidance and evidence as constraints, not as claims that gamification alone guarantees behavior change.

- Awwwards' Mobile Excellence material emphasizes usability, legible sizing, appropriate tap targets, contrast, visible calls to action, mobile performance, offline response, and avoiding notification permission on page load. Odyssey reflects those requirements in its quality bar and contextual permission flow: [Awwwards Mobile Excellence Guidelines](https://www.awwwards.com/mobile-excellence-guidelines.pdf).
- Apple's current design principles emphasize meaningful purpose, familiar interaction, clear feedback, recovery from mistakes, transparency, and responsible data collection. These directly inform Odyssey's recovery-first model and private-by-default behavior: [Apple Human Interface Guidelines — Design Principles](https://developer.apple.com/design/human-interface-guidelines/design-principles).
- Apple's notification guidance calls for timely, high-value, concise notifications, user consent and customization, avoiding repeated notifications, and excluding sensitive information. Odyssey therefore caps reminder stages, cancels obsolete reminders, and supports private previews: [Apple Human Interface Guidelines — Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications).
- WCAG 2.2 adds requirements and guidance for visible focus, non-obscured focus, alternatives to dragging, and minimum target size. These are explicit release requirements: [W3C — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).
- A systematic review of gamified health apps found goal setting, self-monitoring, feedback, and rewards commonly combined, but did not find that simply adding more techniques correlated with higher ratings. Odyssey uses a small, explainable set rather than a feature pile: [BMJ Open — Gamification for health promotion](https://bmjopen.bmj.com/content/6/10/e012447).
- A 2024 systematic review and meta-analysis found only modest improvements from gamified health apps in several outcomes, reinforcing that game mechanics should support rather than substitute for the core behavior: [PubMed — Digital health applications with or without gamification](https://pubmed.ncbi.nlm.nih.gov/39764571/).

---

## 25. Product Definition of Done

Odyssey V1 is done only when:

1. Every `MVP-*` feature has its happy path, partial path, error path, offline path, and permission-denied path implemented where applicable.
2. The end-to-end acceptance journey passes on the agreed iOS and Android device range.
3. Calendar, occurrence, reminder, completion, proof, metric, and deletion behavior remain consistent across force-close, relaunch, time-zone, and daylight-saving transitions.
4. Consistency, intensity, Momentum, and XP match the documented formulas with deterministic tests.
5. Private proof remains inside the application sandbox unless explicitly exported, and deletion is verified.
6. Notification caps, quiet hours, privacy previews, cancellation, and terminal-state suppression are verified on real devices.
7. `DESIGN.md` quality, accessibility, responsive, and performance definitions of done pass.
8. No external integration or provider-dependent product feature has entered MVP scope.
9. No visual example has silently created a new product rule.
10. Product, design, engineering, and QA can each state plainly what shipped, what was simplified, and what remains in the extra-feature backlog.
