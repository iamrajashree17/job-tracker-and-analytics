"use client";
import { useState, useRef } from "react";

// ─── ALL 96 DAYS DATA ────────────────────────────────────────────────────────
const PHASES = [
  {
    id:1, emoji:"🏗️", label:"Foundations", span:"Weeks 1–3",
    color:"#818CF8", glow:"rgba(129,140,248,0.15)",
    desc:"Core building blocks every system design uses — networking, caching, databases, queues",
    weeks:[
      { n:1, title:"Networking & Communication", focus:"How data travels across the internet",
        days:[
          { n:1,  title:"How the Internet Works",            tags:["TCP/IP Model","OSI 7 Layers","HTTP vs HTTPS","Packets & Routing","Latency vs Throughput"] },
          { n:2,  title:"DNS Deep Dive",                     tags:["DNS Resolver Chain","Authoritative Nameservers","A/CNAME/MX/TXT Records","TTL","DNS Caching & Propagation"] },
          { n:3,  title:"Content Delivery Networks (CDN)",   tags:["Edge Servers & PoPs","Cache Hit/Miss Ratio","Push vs Pull CDN","Anycast Routing","When to use CDN"] },
          { n:4,  title:"Load Balancers",                    tags:["L4 vs L7 LB","Round Robin","Least Connections","IP Hash","Sticky Sessions","Health Checks"] },
          { n:5,  title:"REST vs GraphQL vs gRPC",           tags:["HTTP Methods & Status Codes","REST Constraints","GraphQL Schema & Resolvers","Protocol Buffers","Bidirectional Streaming"] },
          { n:6,  title:"Real-time Communication Patterns",  tags:["Short Polling","Long Polling","WebSockets (bidirectional)","Server-Sent Events (SSE)","Trade-off Matrix"] },
        ]},
      { n:2, title:"Core Building Blocks", focus:"Components that appear in every system you'll ever design",
        days:[
          { n:7,  title:"Caching Fundamentals",              tags:["Cache Hit/Miss","TTL","LRU vs LFU Eviction","Redis vs Memcached","Cache Hierarchy (L1/L2/App/CDN)"] },
          { n:8,  title:"Caching Strategies",                tags:["Cache-Aside (Lazy Loading)","Write-Through","Write-Behind (Write-Back)","Read-Through","Cache Stampede & Fix"] },
          { n:9,  title:"Message Queues",                    tags:["Apache Kafka","RabbitMQ","AWS SQS","Producers & Consumers","FIFO vs Priority Queue","Dead Letter Queue"] },
          { n:10, title:"Pub/Sub Architecture",              tags:["Topics & Subscriptions","Fan-out Pattern","At-least/At-most/Exactly-once Delivery","Ordering Guarantees","vs Message Queue"] },
          { n:11, title:"API Gateway & Service Mesh",        tags:["Auth & AuthZ","Rate Limiting","Request Routing","Istio/Envoy Sidecar Proxy","mTLS Between Services","Observability"] },
          { n:12, title:"Proxies (Forward, Reverse, Transparent)", tags:["Forward Proxy","Reverse Proxy (Nginx)","SSL Termination","Transparent Proxy","VPN vs Proxy vs CDN"] },
        ]},
      { n:3, title:"Database Deep Dive", focus:"SQL, NoSQL, replication, sharding and the CAP theorem",
        days:[
          { n:13, title:"SQL vs NoSQL — When to Use Which",  tags:["ACID vs BASE","Structured vs Unstructured","Join Support","Schema Flexibility","Choosing in an Interview"] },
          { n:14, title:"SQL Internals",                     tags:["B-Tree & B+Tree Indexes","Query Planner & Execution","Transaction Isolation Levels (RC/RR/SER)","Normalization 1NF–3NF","Index Trade-offs"] },
          { n:15, title:"NoSQL Database Types",              tags:["Key-Value (Redis, DynamoDB)","Document (MongoDB, Firestore)","Column-family (Cassandra, HBase)","Graph (Neo4j)","When to use each"] },
          { n:16, title:"Database Replication",              tags:["Primary-Replica (Master-Slave)","Multi-Master Replication","Sync vs Async Replication","Replication Lag Problem","Read Replicas for Scale"] },
          { n:17, title:"Sharding & Partitioning",           tags:["Horizontal vs Vertical Sharding","Shard Key Selection Criteria","Range/Hash/Directory-based Sharding","Hotspot Problem","Cross-shard Queries"] },
          { n:18, title:"CAP Theorem & PACELC",              tags:["Consistency","Availability","Partition Tolerance","CP vs AP System Examples","DynamoDB vs Cassandra vs MongoDB"] },
        ]},
    ]
  },
  {
    id:2, emoji:"⚡", label:"Scale & Reliability", span:"Weeks 4–5",
    color:"#34D399", glow:"rgba(52,211,153,0.15)",
    desc:"Design systems that scale to 100M users and maintain 99.99% uptime",
    weeks:[
      { n:4, title:"Scalability Patterns", focus:"How to scale any component or entire system",
        days:[
          { n:19, title:"Horizontal vs Vertical Scaling",    tags:["Scale-up vs Scale-out","Stateless Service Design","Auto-scaling Triggers (CPU/Queue depth)","Cost Trade-offs","State Externalization"] },
          { n:20, title:"Rate Limiting Algorithms",          tags:["Token Bucket","Leaky Bucket","Fixed Window Counter","Sliding Window Log","Sliding Window Counter","Distributed Rate Limiting (Redis)"] },
          { n:21, title:"Consistent Hashing",                tags:["Hash Ring Concept","Virtual Nodes (vnodes)","Node Addition/Removal (minimal reshuffling)","Used in Cassandra & Memcached","vs Naive Modulo Hashing"] },
          { n:22, title:"Probabilistic Data Structures",     tags:["Bloom Filter (false positives only)","Count-Min Sketch","HyperLogLog (cardinality)","Space Efficiency vs Accuracy","Real-world Use Cases"] },
          { n:23, title:"Circuit Breaker Pattern",           tags:["Open/Half-Open/Closed States","Cascading Failure Prevention","Hystrix & Resilience4j","Fallback Logic Design","Health Threshold Configuration"] },
          { n:24, title:"Retry, Timeout & Bulkhead Patterns",tags:["Exponential Backoff + Jitter","Idempotency Keys","Bulkhead Isolation (threadpool/semaphore)","Timeout Configuration","Combining Patterns Together"] },
        ]},
      { n:5, title:"Reliability & Observability", focus:"Keeping systems up — and knowing when they're not",
        days:[
          { n:25, title:"High Availability Design",          tags:["99.9% vs 99.99% vs 99.999% SLA","Eliminating Single Points of Failure","Redundancy at Each Tier","Active-Active vs Active-Passive","Geographic Distribution"] },
          { n:26, title:"Fault Tolerance Strategies",        tags:["Health Check Endpoints","Automatic Failover","Data Replication for Durability","Graceful Degradation Design","Chaos Engineering"] },
          { n:27, title:"Disaster Recovery",                 tags:["RPO (Recovery Point Objective)","RTO (Recovery Time Objective)","Hot/Warm/Cold Standby","Backup Strategies","DR Testing"] },
          { n:28, title:"Observability — Metrics, Logs, Traces", tags:["Metrics (Prometheus + Grafana)","Centralized Logging (ELK Stack)","Distributed Tracing (Jaeger/Zipkin)","SLI/SLO/SLA Definitions","Alerting Rules & On-call"] },
          { n:29, title:"Service Discovery",                 tags:["Client-side vs Server-side Discovery","Consul & Etcd","Spring Eureka","Kubernetes DNS & Services","Health-endpoint-based Registration"] },
          { n:30, title:"Security in System Design",         tags:["OAuth2 & JWT Auth","HTTPS/TLS Everywhere","CORS & XSS Protection","DDoS Mitigation (WAF, rate limiting)","Secrets Management (Vault)"] },
        ]},
    ]
  },
  {
    id:3, emoji:"🎯", label:"Interview Framework", span:"Week 6",
    color:"#FBBF24", glow:"rgba(251,191,36,0.15)",
    desc:"A repeatable step-by-step process to confidently answer any system design question",
    weeks:[
      { n:6, title:"The System Design Interview Playbook", focus:"Structure, estimation, API design, and common traps",
        days:[
          { n:31, title:"The Interview Framework (URED)",        tags:["U: Understand & Clarify","R: Requirements (Functional + Non-Functional)","E: Estimate Scale (QPS, storage, bandwidth)","D: Design → Deep Dive → Review","Time-boxing each step"] },
          { n:32, title:"Capacity Estimation Masterclass",       tags:["Latency Numbers Every Engineer Must Know","Storage Math (B→KB→GB→TB→PB)","QPS = DAU × actions ÷ 86,400","Bandwidth Estimation","Back-of-envelope Tricks"] },
          { n:33, title:"Data Modeling Practice",                tags:["Relational Schema for Common Systems","NoSQL Schema Design (denormalize for reads)","Choosing Data Types Wisely","Denormalization Trade-offs","Index Strategy for Read Patterns"] },
          { n:34, title:"API Design",                            tags:["REST Endpoint Naming Conventions","Request/Response Shape Design","Pagination: Cursor vs Offset","API Versioning Strategy","Error Codes & Standard Responses"] },
          { n:35, title:"Drawing the Architecture Diagram",      tags:["Client → LB → Service → Cache → DB","CDN Placement","Async Paths via Message Queue","Annotation Best Practices","What Interviewers Check For"] },
          { n:36, title:"Common Pitfalls & How to Avoid Them",   tags:["Jumping to Solution Without Requirements","Ignoring Non-Functional Requirements","Skipping Capacity Estimation","Not Articulating Trade-offs","How to Handle 'I Don't Know'"] },
        ]},
    ]
  },
  {
    id:4, emoji:"🏛️", label:"Classic Systems", span:"Weeks 7–12",
    color:"#FB923C", glow:"rgba(251,146,60,0.15)",
    desc:"End-to-end designs for the 30 most-asked interview systems",
    weeks:[
      { n:7, title:"URL Shortener & Web Crawlers", focus:"Hashing, encoding, and large-scale web traversal",
        days:[
          { n:37, title:"URL Shortener — Requirements & Estimation", tags:["100M DAU","Read-heavy 100:1 ratio","Storage Estimate: 365B rows over 5 yrs","Latency Goal <10ms for redirect","Custom short URLs & Expiry"] },
          { n:38, title:"URL Shortener — Data Model & APIs",         tags:["shortURL Table Schema","Base62 Encoding (a-z A-Z 0-9)","encode() / decode() APIs","301 vs 302 Redirect Trade-off","Rate Limiting Abuse Prevention"] },
          { n:39, title:"URL Shortener — Deep Dive",                 tags:["Collision Handling (UUID fallback)","Cache Layer (Redis for hot URLs)","Analytics Click Tracking","Expiry & Cleanup Background Jobs","Bloom Filter for existence check"] },
          { n:40, title:"Pastebin Design",                           tags:["Text Storage in S3 (not DB)","Paste Table Schema","Content Hash for Deduplication","Expiry TTL","Syntax Highlighting Microservice","CDN for reads"] },
          { n:41, title:"Web Crawler — Architecture Overview",       tags:["BFS URL Traversal","URL Frontier Priority Queue","robots.txt Compliance","Politeness Delay (1 req/sec/domain)","Seed URL Selection"] },
          { n:42, title:"Web Crawler — Deep Dive",                   tags:["URL Deduplication via Bloom Filter","DNS Resolver Pool","HTML Link Extractor","Content Fingerprinting (Simhash)","Distributed Crawler Architecture"] },
        ]},
      { n:8, title:"Chat & Messaging Systems", focus:"Real-time, reliable, planet-scale messaging",
        days:[
          { n:43, title:"WhatsApp — Requirements & Scale",      tags:["2 Billion Users","65 Billion Messages/Day","Online Presence & Typing Indicators","Group Chats (512 members)","Delivery & Read Receipts"] },
          { n:44, title:"WhatsApp — Message Flow Design",       tags:["WebSocket Long-lived Connections","Chat Service Message Routing","Offline Storage (HBase/Cassandra)","Message Sync Across Multiple Devices","Presence Service Design"] },
          { n:45, title:"WhatsApp — Group Chat & Media",        tags:["Group Message Fan-out Strategy","Media Upload to S3 + CDN","End-to-End Encryption (Signal Protocol overview)","Key Distribution Center","Encrypted Metadata"] },
          { n:46, title:"Slack-like System Design",             tags:["Workspaces & Channels Architecture","Thread Design (parent_id)","Full-text Search (Elasticsearch)","Notification Routing","Real-time with WebSocket + Pub/Sub"] },
          { n:47, title:"Push Notification System",             tags:["FCM (Android) & APNs (iOS)","Notification Service Architecture","Priority Queues (urgent vs marketing)","Batching & Deduplication Logic","Delivery Status Tracking"] },
          { n:48, title:"Email System (Gmail-like)",            tags:["SMTP/IMAP Protocol Basics","Inbox Storage (label-based not folders)","Full-text Search with Lucene","Spam Filtering Pipeline (ML overview)","Large Attachment Storage (S3)"] },
        ]},
      { n:9, title:"Social Media & Feed Systems", focus:"The hardest interview problem — designing a news feed at scale",
        days:[
          { n:49, title:"Twitter — Core Storage Design",         tags:["User Table Schema","Tweet Table (Snowflake tweet_id)","Follow Graph (adjacency list in DB)","Hashtag & Mention Indexes","Trending Topics via Count-Min Sketch"] },
          { n:50, title:"Twitter — News Feed (Fan-out Strategy)",tags:["Fan-out on Write (push model)","Fan-out on Read (pull model)","Hybrid Approach for Celebrities","Timeline Cache in Redis Sorted Set","The Celebrity/Hot User Problem"] },
          { n:51, title:"Instagram Design",                      tags:["Photo Upload Pipeline (S3 + async processing)","Image Resizing & CDN Delivery","Follow Graph Design","Feed Generation Service","Activity Feed (likes, comments, follows)"] },
          { n:52, title:"Facebook News Feed",                    tags:["EdgeRank Algorithm (affinity × weight × time decay)","Feed Retrieval Phase","Feed Ranking Phase","Feed Cache Strategy","Ads Integration (concept only)"] },
          { n:53, title:"LinkedIn Feed Design",                  tags:["Professional Connection Graph (1st/2nd degree)","Content Ranking by Relevance + Recency","Job Recommendations (collaborative filtering overview)","Endorsements & Skills Graph","Viral Content Amplification"] },
          { n:54, title:"Short Video Platform (TikTok-like)",    tags:["Video Processing Pipeline","Recommendation Engine (watch time, likes, shares)","Cold-Start Problem for New Users","Infinite Scroll & Prefetching Strategy","Creator Monetization Flow"] },
        ]},
      { n:10, title:"Video & Media Streaming", focus:"Petabyte-scale media storage and global delivery",
        days:[
          { n:55, title:"YouTube — Video Upload Pipeline",     tags:["Resumable Multipart Upload","Transcoding Service (FFmpeg workers)","Multiple Resolutions (360p to 4K)","Thumbnail Auto-Generation","Metadata in MySQL + Elasticsearch"] },
          { n:56, title:"YouTube — Video Streaming",           tags:["Adaptive Bitrate Streaming (HLS/MPEG-DASH)","CDN-first Video Delivery","Video Chunking (2–10 sec segments)","Prefetching Next Chunk","Approximate View Count"] },
          { n:57, title:"Netflix Architecture Overview",       tags:["Multi-Region Active-Active Setup","Open Connect CDN (ISP-embedded caches)","A/B Testing Infrastructure at Scale","Chaos Monkey (resilience testing)","Personalised Recommendations (overview)"] },
          { n:58, title:"Live Streaming (Twitch-like)",        tags:["RTMP Ingest Protocol","Low-Latency HLS (LL-HLS, sub-2s delay)","Real-time Transcoding Farm","Chat at Scale (horizontal Redis pub/sub)","VOD Recording & Replay Storage"] },
          { n:59, title:"Music Streaming (Spotify-like)",      tags:["Audio File Storage (S3 with DRM)","Adaptive Audio Streaming","Playlist & Library Service Design","Offline Download with License Keys","Recommendations (collaborative filtering overview)"] },
          { n:60, title:"Image Processing Service (Cloudinary-like)", tags:["Upload Pipeline (multipart → S3)","On-the-fly Transformations (resize, crop, watermark)","CDN Integration with Cache Keys","Signed URLs & Expiring Links","Object Storage API"] },
        ]},
      { n:11, title:"Location, Marketplace & Commerce", focus:"Geospatial systems and high-stakes transactional platforms",
        days:[
          { n:61, title:"Uber — Driver Location & Matching",   tags:["Location Updates Every 4 Seconds","Geospatial Indexing (Google S2 Cells)","Nearest-Driver Dispatch Algorithm","Supply/Demand Zone Heatmap","Real-time ETA Calculation"] },
          { n:62, title:"Uber — Trip Lifecycle & Payments",    tags:["Trip State Machine (Requested→Accepted→InProgress→Completed)","Surge Pricing Algorithm","Payment Processing Flow","Driver & Rider Rating System","Route Optimisation (OSRM)"] },
          { n:63, title:"Google Maps Design",                  tags:["Map Tile System (z/x/y coordinate scheme)","Routing Algorithm (A* with heuristics)","Real-time Traffic Data Integration","ETA: Historical + Live Traffic Model","Points of Interest Index"] },
          { n:64, title:"Proximity Search (Yelp-like)",        tags:["Geohashing (lat/lng → base32 string)","Quadtree Spatial Indexing","Radius Search Queries","Ranking: Distance + Rating + Review Count","Business Index in Elasticsearch"] },
          { n:65, title:"Hotel Booking (Airbnb-like)",         tags:["Availability Calendar Design","Double-Booking Prevention (Optimistic Locking)","Inventory Service Architecture","Search with Date + Location + Filters","Booking State Machine"] },
          { n:66, title:"E-commerce System (Amazon-like)",     tags:["Product Catalog (Elasticsearch + RDBMS)","Cart Service (Redis ephemeral)","Inventory Decrement on Order (atomic)","Order Lifecycle State Machine","Flash Sales & Distributed Lock"] },
        ]},
      { n:12, title:"Search, Data & Infrastructure", focus:"Search engines, distributed caches, payments, and IDs",
        days:[
          { n:67, title:"Search Autocomplete (Typeahead)",     tags:["Trie Data Structure","Top-K Suggestions via Min-Heap","Distributed Trie with Shard by Prefix","Analytics Feedback Loop","Aggregation Service for Trending Searches"] },
          { n:68, title:"Google Search — Architecture Overview",tags:["PageRank Algorithm (link graph)","Inverted Index Construction","Web Crawl → Parse → Index Pipeline","Query Processing: tokenise, lookup, rank","200+ Ranking Signals (overview)"] },
          { n:69, title:"Distributed Cache (Redis-like System)",tags:["Consistent Hashing for Cluster Nodes","Primary-Replica Replication","Eviction Policies (LRU, LFU, TTL, noeviction)","Persistence: RDB Snapshots vs AOF Log","Redis Sentinel vs Redis Cluster"] },
          { n:70, title:"Metrics & Analytics Platform",        tags:["Time-Series DB (InfluxDB/Prometheus)","High-volume Ingestion via Kafka","Pre-aggregation Pipeline (1m, 5m, 1h buckets)","Dashboard Query Engine","Alerting Rules & Notification Routing"] },
          { n:71, title:"Payment System Design",               tags:["Double-entry Ledger Schema","Idempotency Keys (prevent duplicate charges)","Transaction State Machine","End-of-day Reconciliation Jobs","Fraud Detection (feature pipeline overview)"] },
          { n:72, title:"Distributed ID Generator (Snowflake-like)", tags:["Snowflake ID: 41b timestamp + 5b DC + 5b machine + 12b seq","Monotonically Increasing for B-tree Index Locality","UUID vs Snowflake vs ULID Trade-offs","Tick-Tock Clock Problem","Clock Synchronisation (NTP)"] },
        ]},
    ]
  },
  {
    id:5, emoji:"🧠", label:"Advanced Topics", span:"Weeks 13–14",
    color:"#F87171", glow:"rgba(248,113,113,0.15)",
    desc:"Distributed systems depth that separates seniors from staff engineers",
    weeks:[
      { n:13, title:"Distributed Systems Deep Dive", focus:"The internals powering every large-scale system",
        days:[
          { n:73, title:"Distributed Transactions",           tags:["2-Phase Commit (2PC): Prepare + Commit","Saga Pattern (long-running transactions)","Choreography vs Orchestration Sagas","Compensating Transactions (rollback)","Idempotency for Safe Retries"] },
          { n:74, title:"Consensus — Raft Algorithm",         tags:["Leader Election (randomised timeout)","Log Replication (AppendEntries RPC)","Term Numbers (monotonic)","Quorum = (N÷2)+1","Split-brain Prevention"] },
          { n:75, title:"Event Sourcing & CQRS",              tags:["Append-only Event Log (source of truth)","Projections (build read models from events)","Read Model vs Write Model Separation","Event Replay for State Rebuild","When to use CQRS (vs when NOT to)"] },
          { n:76, title:"Eventual Consistency Patterns",      tags:["Last-Write-Wins (LWW — Cassandra default)","Vector Clocks (causal ordering)","CRDTs (Conflict-free Replicated Data Types)","Merkle Trees for Data Sync","Anti-entropy Reconciliation"] },
          { n:77, title:"Distributed Locking",                tags:["Redlock Algorithm (Redis multi-node, 5 instances)","ZooKeeper Ephemeral Sequential Nodes","Fencing Tokens (monotonic counter prevents stale locks)","TTL-based Lock Expiry","Lock-free Alternatives (CAS, optimistic locking)"] },
          { n:78, title:"Apache Kafka — Deep Dive",           tags:["Topics, Partitions, Replicas (replication factor)","Consumer Groups & Partition Assignment","Offset Management (commit strategies)","Exactly-once Semantics (idempotent producer + transactions)","Log Compaction & Retention"] },
        ]},
      { n:14, title:"Modern Architecture Patterns", focus:"Microservices, serverless, gRPC, and beyond",
        days:[
          { n:79, title:"Microservices vs Monolith",          tags:["Trade-off Analysis (team size, domain complexity)","Strangler Fig Migration Pattern","Service Decomposition by Bounded Context","Data Ownership per Service (no shared DB)","When NOT to use Microservices"] },
          { n:80, title:"Service Mesh — Istio/Envoy",         tags:["Sidecar Proxy Pattern (transparent to app)","Mutual TLS (mTLS) Between Services","Traffic Management (canary, A/B, mirroring)","Mesh-level Observability","Circuit Breaking & Retry in the Mesh"] },
          { n:81, title:"Kubernetes for System Design Context",tags:["Pods, Services, Deployments","Ingress Controllers (external traffic)","HPA — Horizontal Pod Autoscaler","StatefulSets for Databases & Queues","Rolling Deployments & Instant Rollback"] },
          { n:82, title:"Serverless Architecture",            tags:["FaaS: AWS Lambda, GCP Cloud Functions","Cold Start Problem & Mitigation","Event-driven Trigger Patterns (S3, SQS, HTTP)","Cost Model: Pay-per-Invocation","Limitations: No persistent state, 15 min timeout, vendor lock-in"] },
          { n:83, title:"GraphQL Architecture Deep Dive",     tags:["Schema Design (types, queries, mutations, subscriptions)","Resolver Chain Execution","N+1 Problem (the DataLoader solution)","Real-time Subscriptions via WebSocket","Federation for Multi-service GraphQL"] },
          { n:84, title:"gRPC & Protocol Buffers",            tags:["Protobuf Schema (.proto file)","4 RPC Types: Unary, Server/Client/Bidirectional Streaming","HTTP/2 Multiplexing (no head-of-line blocking)","Service Definition & Code Generation","gRPC vs REST: When to Choose Each"] },
        ]},
    ]
  },
  {
    id:6, emoji:"🎤", label:"Mock Interviews", span:"Weeks 15–16",
    color:"#A78BFA", glow:"rgba(167,139,250,0.15)",
    desc:"Timed practice, final cheat sheets, and mental prep before the real thing",
    weeks:[
      { n:15, title:"Timed Mock Interview Sessions", focus:"45 minutes per problem — simulate real interview conditions",
        days:[
          { n:85, title:"Mock #1 — Design URL Shortener",    tags:["⏱ 45-min timer ON","Requirements → Estimate → Design → Deep Dive","Check: caching strategy?","Check: trade-offs articulated?","Self-grade after: what did you miss?"] },
          { n:86, title:"Mock #2 — Design a Chat System",    tags:["⏱ 45-min timer ON","Emphasise real-time + offline handling","Push notification integration","Delivery receipt design","Trade-off articulation practice"] },
          { n:87, title:"Mock #3 — Design Social Media Feed",tags:["⏱ 45-min timer ON","Justify fan-out on write vs read","Cache strategy reasoning","Ranking signals discussion","Handle follow-up deep-dives confidently"] },
          { n:88, title:"Mock #4 — Design Video Streaming",  tags:["⏱ 45-min timer ON","Upload pipeline + streaming path separation","CDN strategy and rationale","Encoding pipeline discussion","Adaptive bitrate mention"] },
          { n:89, title:"Mock #5 — Design a Ride-Sharing App",tags:["⏱ 45-min timer ON","Location tracking design","Driver matching algorithm","Surge pricing mechanism","Payment flow at high level"] },
          { n:90, title:"Mock #6 — Your Weakest System",     tags:["Pick the system you struggle with most","Focus on trade-off articulation","Record yourself if possible","Get a peer to time & review","Identify 3 remaining gaps to fix"] },
        ]},
      { n:16, title:"Final Review & Interview Polish", focus:"Reference sheets, senior signals, and mental preparation",
        days:[
          { n:91, title:"Component Cheat Sheet Review",      tags:["Every major component + when to add it","NFR → Component Mapping (consistency→DB replication, speed→CDN+cache)","Decision tree for each problem type","Review your own handwritten notes from weeks 1–14"] },
          { n:92, title:"Trade-off Reference Tables",        tags:["SQL vs NoSQL (5 key dimensions)","Cache strategies comparison matrix","Queue vs Pub/Sub (fan-out needs?)","Sync vs Async Communication","Monolith vs Microservices decision matrix"] },
          { n:93, title:"Estimation Quick Reference Sheet",  tags:["Latency: L1 cache 0.5ns → Network 150ms","Powers of 2 table (2^10=1K, 2^20=1M, 2^30=1B)","Storage math (B→KB→MB→GB→TB→PB)","QPS Formula: DAU × avg_actions ÷ 86,400","Read/Write ratio estimation tips"] },
          { n:94, title:"Senior-Level Depth Signals",        tags:["Proactively raise failure modes","Question vague requirements before designing","Propose 2 alternatives and justify your choice","Show operational awareness: monitoring, runbooks, on-call","Estimate before designing — always"] },
          { n:95, title:"Behavioral + System Design Combined",tags:["Weave real past systems into your designs","'Tell me about a system you built at scale'","Handling follow-up deep-dives under pressure","Communicating clearly when hitting uncertain areas","Confidence without arrogance"] },
          { n:96, title:"Final Mock + Mental Preparation 🚀",tags:["Full simulation (45 min, no pausing, no Google)","Pre-interview ritual: sleep well, light review of cheat sheet","Managing nerves: breathe, think out loud, take your time","Trust the 16 weeks of deliberate work","You are ready — go get it!"] },
        ]},
    ]
  },
];

// ─── SIMPLE MARKDOWN RENDERER ────────────────────────────────────────────────
function parseInline(str, color) {
  const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} style={{ color: "#F1F5F9" }}>{p.slice(2,-2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={i} style={{ background:"#0D1117", color:"#7DD3FC", padding:"1px 6px", borderRadius:4, fontFamily:"monospace", fontSize:"0.87em" }}>{p.slice(1,-1)}</code>;
    return p;
  });
}

function Md({ text, color }) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let listItems = [];
  let listType = null;

  const flushList = (key) => {
    if (!listItems.length) return;
    const El = listType === "ol" ? "ol" : "ul";
    out.push(
      <El key={`list-${key}`} style={{ margin:"6px 0 10px 18px", padding:0, color:"#94A3B8", lineHeight:1.75, fontSize:13.5 }}>
        {listItems}
      </El>
    );
    listItems = []; listType = null;
  };

  lines.forEach((line, i) => {
    const ul = line.match(/^[-*]\s(.+)/);
    const ol = line.match(/^\d+\.\s(.+)/);
    if (!ul && !ol) flushList(i);

    if (line.startsWith("## ")) {
      out.push(
        <div key={i} style={{ borderLeft: `3px solid ${color || "#818CF8"}`, paddingLeft:12, margin:"18px 0 8px" }}>
          <h2 style={{ fontSize:14.5, fontWeight:700, color:"#F1F5F9", margin:0 }}>{parseInline(line.slice(3), color)}</h2>
        </div>
      );
    } else if (line.startsWith("### ")) {
      out.push(<h3 key={i} style={{ fontSize:13, fontWeight:700, color:"#CBD5E1", margin:"12px 0 5px" }}>{parseInline(line.slice(4), color)}</h3>);
    } else if (ul) {
      listType = "ul";
      listItems.push(<li key={i} style={{ marginBottom:5 }}>{parseInline(ul[1], color)}</li>);
    } else if (ol) {
      listType = "ol";
      listItems.push(<li key={i} style={{ marginBottom:5 }}>{parseInline(ol[1].replace(/^\d+\.\s/,""), color)}</li>);
    } else if (line.trim()) {
      out.push(<p key={i} style={{ margin:"4px 0 8px", color:"#94A3B8", fontSize:13.5, lineHeight:1.75 }}>{parseInline(line, color)}</p>);
    } else {
      out.push(<div key={i} style={{ height:6 }} />);
    }
  });
  flushList("end");
  return <>{out}</>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activePhase, setActivePhase]   = useState(0);
  const [openWeeks, setOpenWeeks]       = useState({ "0-0": true });
  const [completed, setCompleted]       = useState(new Set());
  const [view, setView]                 = useState("plan");
  const [selDay, setSelDay]             = useState(null);
  const [explanation, setExplanation]   = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const topRef = useRef(null);

  const TOTAL = 96;
  const pct   = Math.round((completed.size / TOTAL) * 100);
  const phase  = PHASES[activePhase];

  const openLearn = (day, ph) => {
    setSelDay({ day, phase: ph });
    setExplanation(""); setError(""); setLoading(false);
    setView("learn");
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const fetchExplanation = async () => {
    if (!selDay || loading) return;
    setLoading(true); setError(""); setExplanation("");
    const { day, phase: ph } = selDay;
    const prompt = `Explain this system design concept for a SENIOR software engineering interview preparation:

**Topic: ${day.title}**
Phase: ${ph.label}
Key concepts to cover: ${day.tags.join(" | ")}

Please write a thorough explanation with these exact sections using markdown formatting:

## 🔍 What Is It?
Crisp definition + intuitive mental model or analogy.

## ⚙️ How It Works — Technical Depth
Step-by-step mechanism. Include real specifics, numbers, and a concrete example.

## 🔄 Alternatives & Trade-offs
Compare with main alternatives. When does each choice win?

## ✅ When to Use / ❌ When NOT to Use
Concrete signals for when to bring this up or avoid it in a system design interview.

## 🎯 Senior-Level Talking Points
The exact points that make an answer sound "senior" vs "mid-level". Mention failure modes, edge cases, and operational concerns proactively.

## 💡 Key Numbers & Facts to Memorise
Specific metrics, thresholds, or facts worth remembering for interviews.

## 📝 Sample Interview Question & Structured Answer Outline
One realistic interview question involving this concept, with a brief structured answer outline.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const txt = data.content?.find(b => b.type === "text")?.text || "No content returned.";
      setExplanation(txt);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (n, e) => {
    e.stopPropagation();
    setCompleted(prev => { const nx = new Set(prev); nx.has(n) ? nx.delete(n) : nx.add(n); return nx; });
  };
  const toggleWeek = (k) => setOpenWeeks(prev => ({ ...prev, [k]: !prev[k] }));

  const findDay = (n) => {
    for (const p of PHASES) for (const w of p.weeks) {
      const d = w.days.find(d => d.n === n);
      if (d) return { day: d, phase: p };
    }
    return null;
  };

  // ── LEARN VIEW ─────────────────────────────────────────────────────────────
  if (view === "learn" && selDay) {
    const { day, phase: ph } = selDay;
    const done = completed.has(day.n);
    const prev = day.n > 1 ? findDay(day.n - 1) : null;
    const next = day.n < 96 ? findDay(day.n + 1) : null;

    return (
      <div ref={topRef} style={{ background:"#07090F", minHeight:"100vh", color:"#E2E8F0", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:60 }}>
        {/* Sticky nav bar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1E293B", display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, background:"#07090F", zIndex:20 }}>
          <button onClick={() => setView("plan")}
            style={{ background:"#111827", border:"1px solid #1E293B", color:"#94A3B8", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:600, flexShrink:0 }}>
            ← Plan
          </button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, color:ph.color, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px" }}>Day {day.n} · {ph.emoji} {ph.label}</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:"#F1F5F9", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{day.title}</div>
          </div>
          <button onClick={(e) => toggleDay(day.n, e)}
            style={{ flexShrink:0, background: done ? `${ph.color}22` : "#111827", border:`1.5px solid ${done ? ph.color : "#1E293B"}`, color: done ? ph.color : "#475569", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            {done ? "✓ Done" : "Mark Done"}
          </button>
        </div>

        <div style={{ maxWidth:740, margin:"0 auto", padding:"20px 20px 0" }}>
          {/* Tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:20 }}>
            {day.tags.map((t,i) => (
              <span key={i} style={{ fontSize:11, color:ph.color, background:`${ph.color}14`, borderRadius:5, padding:"3px 9px", fontWeight:600 }}>{t}</span>
            ))}
          </div>

          {/* Generate button — initial state */}
          {!explanation && !loading && !error && (
            <div style={{ textAlign:"center", padding:"44px 20px", background:"#0B1120", borderRadius:16, border:`1px solid ${ph.color}20`, marginBottom:16 }}>
              <div style={{ fontSize:42, marginBottom:14 }}>🤖</div>
              <div style={{ fontSize:13.5, color:"#64748B", marginBottom:6, lineHeight:1.7 }}>
                Get a <strong style={{ color:"#94A3B8" }}>senior-level explanation</strong> for this concept.<br/>
                Covers: what it is, how it works, trade-offs, interview tips, and a sample Q&A.
              </div>
              <button onClick={fetchExplanation}
                style={{ marginTop:16, background:ph.color, color:"#000", border:"none", borderRadius:10, padding:"12px 32px", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 24px ${ph.glow}` }}>
                📖 Generate Full Explanation
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:"center", padding:"48px 0", background:"#0B1120", borderRadius:16, border:"1px solid #1E293B", marginBottom:16 }}>
              <div style={{ fontSize:28, marginBottom:10 }}>⏳</div>
              <div style={{ fontSize:13, color:"#475569" }}>Generating senior-level explanation for <span style={{ color:ph.color }}>{day.title}</span>…</div>
              <div style={{ fontSize:11, color:"#334155", marginTop:6 }}>Covering trade-offs, internals, and interview tips</div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background:"#1A0A0A", border:"1px solid #7F1D1D", borderRadius:12, padding:"16px 20px", marginBottom:16 }}>
              <div style={{ color:"#F87171", fontSize:13, marginBottom:10 }}>⚠️ {error}</div>
              <button onClick={fetchExplanation} style={{ background:"transparent", border:"1px solid #7F1D1D", color:"#F87171", borderRadius:6, padding:"5px 14px", cursor:"pointer", fontSize:12 }}>Retry</button>
            </div>
          )}

          {/* Explanation content */}
          {explanation && (
            <>
              <div style={{ background:"#0B1120", border:`1px solid ${ph.color}25`, borderRadius:14, padding:"22px 22px 16px", marginBottom:12 }}>
                <Md text={explanation} color={ph.color} />
              </div>
              <button onClick={fetchExplanation}
                style={{ background:"transparent", border:"1px solid #1E293B", color:"#475569", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:12, width:"100%", marginBottom:14 }}>
                🔄 Regenerate explanation
              </button>
            </>
          )}

          {/* Prev / Next navigation */}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            {prev && (
              <button onClick={() => openLearn(prev.day, prev.phase)}
                style={{ flex:1, background:"#0B1120", border:"1px solid #1E293B", color:"#94A3B8", borderRadius:8, padding:"10px 12px", cursor:"pointer", fontSize:11.5, textAlign:"left", lineHeight:1.4 }}>
                <div style={{ color:"#475569", fontSize:10 }}>← Day {prev.day.n}</div>
                <div style={{ fontWeight:600 }}>{prev.day.title}</div>
              </button>
            )}
            {next && (
              <button onClick={() => openLearn(next.day, next.phase)}
                style={{ flex:1, background:"#0B1120", border:"1px solid #1E293B", color:"#94A3B8", borderRadius:8, padding:"10px 12px", cursor:"pointer", fontSize:11.5, textAlign:"right", lineHeight:1.4 }}>
                <div style={{ color:"#475569", fontSize:10 }}>Day {next.day.n} →</div>
                <div style={{ fontWeight:600 }}>{next.day.title}</div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PLAN VIEW ──────────────────────────────────────────────────────────────
  return (
    <div style={{ background:"#07090F", minHeight:"100vh", color:"#E2E8F0", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:60 }}>
      {/* Header */}
      <div style={{ padding:"28px 22px 0", maxWidth:960, margin:"0 auto" }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#F8FAFC", letterSpacing:"-0.4px", marginBottom:3 }}>
          📐 System Design Master Plan
        </div>
        <div style={{ fontSize:12.5, color:"#475569", marginBottom:16 }}>
          16 Weeks · 96 Days · 1 Hour/Day · Senior Engineer Level · Click any day to study with AI
        </div>
        {/* Progress */}
        <div style={{ background:"#1E293B", borderRadius:8, height:7, overflow:"hidden", marginBottom:5 }}>
          <div style={{ height:"100%", width:`${pct}%`, background:phase.color, borderRadius:8, transition:"width 0.4s" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#475569", marginBottom:20 }}>
          <span>Day {completed.size}/{TOTAL} completed</span>
          <span style={{ color:phase.color, fontWeight:700 }}>{pct}% done</span>
        </div>
      </div>

      {/* Phase tabs */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"0 22px 18px" }}>
        <div style={{ display:"flex", gap:5, overflowX:"auto", scrollbarWidth:"none" }}>
          {PHASES.map((p,i) => {
            const active = activePhase === i;
            return (
              <button key={p.id}
                onClick={() => { setActivePhase(i); setOpenWeeks({ [`${i}-0`]: true }); }}
                style={{ flexShrink:0, padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600,
                  border:`1.5px solid ${active ? p.color : "#1E293B"}`,
                  background: active ? `${p.color}18` : "#0F172A",
                  color: active ? p.color : "#475569", whiteSpace:"nowrap", transition:"all 0.15s" }}>
                {p.emoji} {p.label} <span style={{ opacity:0.55, fontSize:10, marginLeft:3 }}>{p.span}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"0 22px" }}>
        {/* Phase summary */}
        <div style={{ marginBottom:16, padding:"14px 18px", borderRadius:12, border:`1px solid ${phase.color}20`, background:phase.glow, display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:26, lineHeight:1, marginTop:2 }}>{phase.emoji}</div>
          <div>
            <div style={{ fontSize:14.5, fontWeight:700, color:phase.color, marginBottom:3 }}>{phase.label} · {phase.span}</div>
            <div style={{ fontSize:12.5, color:"#94A3B8" }}>{phase.desc}</div>
            <div style={{ display:"flex", gap:14, marginTop:7, fontSize:11.5, color:"#475569" }}>
              <span>📅 {phase.weeks.length} week{phase.weeks.length>1?"s":""}</span>
              <span>📖 {phase.weeks.reduce((a,w)=>a+w.days.length,0)} days</span>
              <span>⏱ {phase.weeks.reduce((a,w)=>a+w.days.length,0)} hours</span>
            </div>
          </div>
        </div>

        {/* Weeks */}
        {phase.weeks.map((week, wi) => {
          const wKey = `${activePhase}-${wi}`;
          const open = !!openWeeks[wKey];
          const wDone = week.days.filter(d => completed.has(d.n)).length;
          return (
            <div key={week.n} style={{ marginBottom:10, border:"1px solid #1E293B", borderRadius:12, overflow:"hidden" }}>
              {/* Week header */}
              <div onClick={() => toggleWeek(wKey)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 16px", cursor:"pointer",
                  background: open ? `${phase.color}08` : "#0B1120", borderBottom: open ? "1px solid #1E293B" : "none",
                  userSelect:"none", transition:"background 0.15s" }}>
                <div style={{ width:26, height:26, borderRadius:6, background:`${phase.color}22`, color:phase.color, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  W{week.n}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#CBD5E1" }}>{week.title}</div>
                  <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{week.focus}</div>
                </div>
                <div style={{ fontSize:11, color:phase.color, fontWeight:700, marginRight:6 }}>{wDone}/{week.days.length}</div>
                <span style={{ color:"#475569", fontSize:10, transform: open ? "rotate(180deg)" : "none", transition:"transform 0.15s" }}>▼</span>
              </div>

              {/* Day cards */}
              {open && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))", gap:9, padding:"12px 12px", background:"#060A14" }}>
                  {week.days.map(day => {
                    const done = completed.has(day.n);
                    return (
                      <div key={day.n}
                        style={{ borderRadius:10, border:`1px solid ${done ? phase.color+"40" : "#1E293B"}`,
                          background: done ? `${phase.color}08` : "#0F172A", padding:"11px 13px",
                          cursor:"pointer", transition:"border-color 0.15s, background 0.15s", position:"relative", overflow:"hidden" }}
                        onClick={() => openLearn(day, phase)}>
                        {/* Left accent bar */}
                        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background: done ? phase.color : "#1E293B", borderRadius:"10px 0 0 10px" }} />
                        {/* Top row */}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5, paddingLeft:7 }}>
                          <span style={{ fontSize:10, color:phase.color, fontWeight:700, letterSpacing:"0.4px" }}>Day {day.n}</span>
                          <div onClick={(e) => toggleDay(day.n, e)}
                            style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${done ? phase.color : "#334155"}`,
                              background: done ? phase.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:10, color:"#000", fontWeight:900, flexShrink:0, transition:"all 0.15s", cursor:"pointer" }}>
                            {done && "✓"}
                          </div>
                        </div>
                        <div style={{ fontSize:12.5, fontWeight:700, color:"#E2E8F0", marginBottom:8, paddingLeft:7, lineHeight:1.4 }}>{day.title}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, paddingLeft:7 }}>
                          {day.tags.map((t,i) => (
                            <span key={i} style={{ fontSize:10, color:phase.color, background:`${phase.color}12`, borderRadius:4, padding:"2px 6px", fontWeight:500 }}>{t}</span>
                          ))}
                        </div>
                        {/* Learn hint */}
                        <div style={{ paddingLeft:7, marginTop:8, fontSize:10.5, color:"#334155" }}>
                          Click to study with AI →
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Footer tip */}
        <div style={{ marginTop:18, padding:"14px 18px", background:"#0B1120", borderRadius:12, border:"1px solid #1E293B" }}>
          <div style={{ fontSize:12.5, color:"#475569", lineHeight:1.75 }}>
            <span style={{ color:"#CBD5E1", fontWeight:600 }}>How to use:</span>
            {" "}Click any day card → 📖 Generate Full Explanation → get a senior-level deep-dive with trade-offs, internals, and a sample interview Q&A.
            {" "}First 30 min: study the generated explanation. Last 30 min: draw the architecture from memory.
            {" "}Check off days as you complete them to track your progress. 🚀
          </div>
        </div>
      </div>
    </div>
  );
}
