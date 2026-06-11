# Stage 1: Priority Inbox System Design & Implementation

## 1. Problem Statement & Objectives
To mitigate information fatigue caused by high volumes of campus broadcasts, this stage introduces a Priority Inbox algorithm. The system dynamically tracks and displays the top $ (where  \in \{5, 10, 15, 20\}$) most critical unread notifications. Priority is computed deterministically using a compounded evaluation matrix balancing static category weight and chronological recency.

## 2. Priority Sorting Criteria & Logic Mechanics
The system defines a strict, non-overlapping priority mapping based on the notification's category type:

```
  HIGHEST PRIORITY                                             LOWEST PRIORITY
+-------------------------+   +------------------------+   +---------------------+
|  "Placement" (Weight 3) | > |  "Result" (Weight 2)   | > |   "Event" (Weight 1) |
+-------------------------+   +------------------------+   +---------------------+
```

### Tie-Breaker Resolution Rule:
When two notifications have identical category weights ( = Weight_B$), the algorithm executes a tie-breaker rule based on chronological recency. The entry with the newer timestamp ( > Timestamp_B$) is sorted above the older record.

## 3. Core Algorithm Implementation (JavaScript / TypeScript)
The following production-ready JavaScript function handles the priority array processing. It creates a shallow array copy, runs the compounded criteria matrix comparison, and slices out the requested threshold ($ items):

JavaScript

```
/**
 * Processes an incoming array of notifications and isolates the top 'n' records
 * sorted strictly by Category Weight (Placement > Result > Event) and Chronological Recency.
 *
 * @param {Array} notifications - The raw array of unread notifications from the server endpoint.
 * @param {number} limit - The number of top priority elements to return (n).
 * @returns {Array} - The filtered and prioritized array pool.
 */
export function getPriorityNotifications(notifications, limit = 10) {
  if (!notifications || !Array.isArray(notifications)) {
    return [];
  }

  // Map category strings to unique static numeric priorities
  const PRIORITY_MAP = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
  };

  return [...notifications]
    .sort((a, b) => {
      const weightA = PRIORITY_MAP[a.Type] || 0;
      const weightB = PRIORITY_MAP[b.Type] || 0;

      // Rule 1: Primary evaluation via strict category weight difference
      if (weightB !== weightA) {
        return weightB - weightA; // Descending order
      }

      // Rule 2: Secondary evaluation via Timestamp tie-breaker
      return new Date(b.Timestamp) - new Date(a.Timestamp); // Most recent first
    })
    .slice(0, limit);
}
```

## 4. Efficient Real-Time Management of Streaming Notifications
Because new campus notifications arrive continuously over WebSockets or long-polling cycles, re-sorting a growing global array of size $ takes $\mathcal{O}(M \log M)$ time, which degrades UI responsiveness.

### The Scalable Solution: Min-Heap Data Structure
To maintain the top 10 notifications with maximum efficiency, we implement a Min-Heap bounded strictly to a size of $ (where  = 10$).

Instead of comparing the new item to all historical records, the heap evaluates it exclusively against the minimum item currently sitting in the priority group:

```
             [ Incoming Notification ]
                         |
                         v
            +--------------------------+
            | Is Heap Size  Insert into Min-Heap (O(log k))
            +--------------------------+
                         | No
                         v
  +----------------------------------------------+
  | Is New Item Priority > Heap Root (Minimum)?  |
  +----------------------------------------------+
                         | Yes
                         v
     - Extract/Pop Heap Root (Minimum Element)
     - Insert New Notification into Min-Heap (O(log k))
```

### Efficiency Matrix Breakdown

- **New Item Ingestion Performance:**Standard Array Approach: $\mathcal{O}(M \log M)$ due to full re-sorting constraints.
- Bounded Min-Heap Approach: $\mathcal{O}(\log k)$ where  \le 10$, keeping execution overhead locked.

- **Memory and Space Complexity:**Standard Array Approach: $\mathcal{O}(M)$ (memory footprint grows infinitely over time).
- Bounded Min-Heap Approach: $\mathcal{O}(k)$ (memory resource caps continuously at exactly 10 items).

- **Extraction of Top 10 Records:**Standard Array Approach: $\mathcal{O}(1)$
- Bounded Min-Heap Approach: $\mathcal{O}(k \log k)$

By capping the data structure at  = 10$, processing an incoming log item remains lightning-fast ($\mathcal{O}(1)$ constant runtime limit), guaranteeing a fluid experience for the end user on both mobile devices and desktop clients.

## 5. Verification Screenshots
Below are the outputs confirming that the Stage 1 system computes, sorts, and isolates priority items correctly:

### 1. All Notifications Stream Interface
This view showcases the application core layout running under the All Logs view with functional category stream filtering.

![All Notifications Stream](1..png)

### 2. Prioritized and Bounded Stream Interface
This view showcases the production-ready Priority Inbox layout handling strict mathematical weight matrices and real-time density limits safely.

![Prioritized Stream Interface](2..png)
