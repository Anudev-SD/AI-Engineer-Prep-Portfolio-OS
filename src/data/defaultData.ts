import { Task, PortfolioProject, InterviewQuestion, SkillTrack, StudySession } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Benchmark hybrid dense + sparse retrieval (BM25 + BGE-large) on Tech Docs corpus',
    category: 'project',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-10-25',
    estimatedHours: 4,
    notes: 'Evaluate NDCG@10 using Reciprocal Rank Fusion (RRF) with k=60 vs dense-only retrieval.',
    resourceLink: 'https://github.com/qdrant/fastembed',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Read & annotate "FlashAttention: Fast and Memory-Efficient Exact Attention"',
    category: 'paper',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-10-22',
    estimatedHours: 2,
    notes: 'Understand SRAM vs HBM memory hierarchy, tiling algorithm, and backward pass recomputation trick.',
    resourceLink: 'https://arxiv.org/abs/2205.14135',
    createdAt: '2026-10-19T14:30:00Z',
  },
  {
    id: 'task-3',
    title: 'Drill RoPE (Rotary Position Embeddings) complex plane derivation & PyTorch code',
    category: 'interview_prep',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-10-23',
    estimatedHours: 1.5,
    notes: 'Be ready to write apply_rotary_pos_emb on whiteboard with broadcasted cos/sin frequencies.',
    createdAt: '2026-10-19T16:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Profile KV Cache memory consumption in 70B parameter model at 8k context',
    category: 'system_design',
    priority: 'medium',
    status: 'done',
    dueDate: '2026-10-18',
    estimatedHours: 3,
    notes: 'Formula: 2 * num_layers * num_kv_heads * head_dim * seq_len * bytes_per_elem. Grouped Query Attention (GQA) saved 8x memory.',
    createdAt: '2026-10-17T09:00:00Z',
    completedAt: '2026-10-18T17:20:00Z',
  },
  {
    id: 'task-5',
    title: 'Implement Multi-Head Attention forward pass from scratch in pure PyTorch (no nn.MultiheadAttention)',
    category: 'leetcode',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-10-24',
    estimatedHours: 2,
    notes: 'Handle batching, sequence masking, scaling factor 1/sqrt(d_k), and softmax stability.',
    createdAt: '2026-10-20T11:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Draft STAR story: Debugging loss spikes during multi-GPU 7B QLoRA fine-tuning',
    category: 'resume_github',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-10-26',
    estimatedHours: 1,
    notes: 'Quantize bfloat16 casting issue in gradient checkpointing, fixed with norm layer precision pin.',
    createdAt: '2026-10-20T12:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Add live Prometheus + Grafana GPU utilization telemetry to vLLM Docker compose',
    category: 'project',
    priority: 'low',
    status: 'todo',
    dueDate: '2026-10-28',
    estimatedHours: 3,
    notes: 'Expose /metrics endpoint for tokens/sec, TTFT, and KV-cache percentage usage.',
    createdAt: '2026-10-20T15:00:00Z',
  },
];

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Agentic RAG Engine with Cross-Encoder Reranking & Self-Correction',
    oneLiner: 'Production-ready knowledge retrieval pipeline combining hybrid vector/BM25 search, query decomposition, and hallucination guardrails.',
    status: 'benchmarking',
    category: 'rag_agents',
    techStack: ['Python', 'FastAPI', 'Qdrant', 'FastEmbed', 'LangGraph', 'Docker', 'PyTest'],
    githubUrl: 'https://github.com/aspiring-ai-eng/agentic-rag-engine',
    demoUrl: 'https://rag-demo.example.dev',
    problemStatement: 'Standard naive vector retrieval often retrieves irrelevant chunks for complex multi-part queries, causing hallucinated LLM responses and low factual precision in technical domains.',
    architectureNotes: `1. Ingestion: Recursive character text splitting (512 tokens with 64 overlap), semantic metadata extraction.
2. Hybrid Retrieval: Qdrant dense vector search (BGE-large-en) combined with sparse BM25 scoring via Reciprocal Rank Fusion (RRF).
3. Reranker Layer: Cross-encoder (bge-reranker-large) scoring top 30 candidates down to top 5 high-precision passages.
4. Agentic Self-Reflection: Evaluates document relevance score; if below threshold, triggers query decomposition and web-fallback tool.
5. Guardrail Filter: Output checks against source attribution before streaming response.`,
    starTalkingPoints: {
      situation: 'Enterprise technical support required grounded answers from 15,000+ API docs where semantic vector search alone missed exact error code matches.',
      task: 'Architect an end-to-end RAG service with <400ms retrieval latency, high recall on technical identifiers, and automated hallucination detection.',
      action: 'Engineered a two-stage hybrid retrieval pipeline with Qdrant and BM25 using RRF; incorporated a cross-encoder reranking stage and deployed on FastAPI with async worker pools.',
      result: 'Boosted answer accuracy from 64% to 91% on internal golden eval set while cutting hallucinated answers to under 3%. Reduced p95 response time to 380ms.',
    },
    deliverables: [
      { id: 'd1', text: 'Document ingestion CLI with chunk visualization', completed: true },
      { id: 'd2', text: 'Hybrid search endpoint with RRF fusion', completed: true },
      { id: 'd3', text: 'Cross-encoder reranking optimization', completed: true },
      { id: 'd4', text: 'Eval suite using RAGAS (Faithfulness, Answer Relevance)', completed: false },
      { id: 'd5', text: 'Dockerfile & docker-compose reproducible environment', completed: true },
    ],
    evalMetrics: [
      { name: 'Faithfulness (RAGAS)', value: '0.94', baseline: '0.67' },
      { name: 'Answer Relevance', value: '0.91', baseline: '0.72' },
      { name: 'p95 Retrieval Latency', value: '380ms', baseline: '850ms' },
    ],
    updatedAt: '2026-10-19T18:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'High-Throughput Local LLM Serving Engine with PagedAttention',
    oneLiner: 'Benchmarked inference gateway using vLLM, continuous batching, and speculative decoding for low Time-to-First-Token.',
    status: 'completed',
    category: 'inference_serving',
    techStack: ['vLLM', 'PyTorch', 'CUDA', 'FastAPI', 'Prometheus', 'Grafana', 'Triton'],
    githubUrl: 'https://github.com/aspiring-ai-eng/vllm-throughput-benchmark',
    demoUrl: 'https://inference.example.dev',
    problemStatement: 'Naive Hugging Face pipeline serving struggles under concurrent traffic due to static batching and severe GPU VRAM fragmentation from linear KV cache allocation.',
    architectureNotes: `1. Engine Core: Implemented vLLM runtime with PagedAttention to eliminate internal fragmentation and support virtual memory mapping of KV caches.
2. Continuous Batching: Iteration-level scheduling allows newly arriving requests to join running batches without waiting for long sequences to finish.
3. Speculative Decoding: Paired 70B model with a 1.1B draft model to generate tokens in parallel, verifying against the target model in a single forward pass.
4. Monitoring: Prometheus metrics exported for TTFT (Time to First Token), TPOT (Time per Output Token), and GPU KV cache utilization.`,
    starTalkingPoints: {
      situation: 'Serving conversational AI with 50+ concurrent users caused out-of-memory errors and sluggish 4.2s Time-to-First-Token on standard Transformers pipelines.',
      task: 'Design a self-hosted inference cluster capable of serving open weights (Llama 3 8B / 70B) with strict SLA (<500ms TTFT) and maximum tokens/second/dollar.',
      action: 'Configured vLLM with PagedAttention, GQA, and continuous batching; integrated speculative decoding using a small draft model and tuned chunked prefill.',
      result: 'Achieved 3.8x throughput increase (from 72 tok/s to 275 tok/s aggregate) while cutting average TTFT by 65% on NVIDIA A10G GPUs.',
    },
    deliverables: [
      { id: 'd6', text: 'vLLM server deployment script with AWQ 4-bit quant', completed: true },
      { id: 'd7', text: 'Locust load-testing scripts with realistic conversation traces', completed: true },
      { id: 'd8', text: 'Prometheus + Grafana dashboard dashboard configs', completed: true },
      { id: 'd9', text: 'Technical write-up: KV cache memory breakdown', completed: true },
    ],
    evalMetrics: [
      { name: 'Aggregate Throughput', value: '275 tok/s', baseline: '72 tok/s' },
      { name: 'Time to First Token (TTFT)', value: '320ms', baseline: '1150ms' },
      { name: 'VRAM Utilization Efficiency', value: '94%', baseline: '48%' },
    ],
    updatedAt: '2026-10-18T14:00:00Z',
  },
  {
    id: 'proj-3',
    title: 'Domain-Specialized Medical VQA via Parameter-Efficient Fine-Tuning (QLoRA)',
    oneLiner: 'Fine-tuned vision-language model for radiology X-ray classification & visual reasoning using 4-bit quantized LoRA.',
    status: 'in_progress',
    category: 'llm_fine_tuning',
    techStack: ['PyTorch', 'Hugging Face', 'PEFT', 'bitsandbytes', 'TRL', 'Weights & Biases'],
    githubUrl: 'https://github.com/aspiring-ai-eng/medical-vqa-qlora',
    problemStatement: 'General vision models fail on specialized medical imaging tasks due to lack of domain-specific anatomical terminology and high false-positive rates.',
    architectureNotes: `1. Model Backbone: Open-source Vision-Language Model with frozen vision tower and 4-bit NormalFloat (NF4) language backbone.
2. Low-Rank Adaptation: Injected LoRA adapters on attention projection matrices (q_proj, v_proj, k_proj, o_proj) with rank r=16, alpha=32.
3. Memory Optimization: Gradient checkpointing enabled + Paged AdamW 8-bit optimizer to prevent GPU memory spikes during long token sequences.
4. Evaluation: Validation on held-out ROCO radiology dataset tracking BLEU-4, ROUGE-L, and clinical terminology accuracy.`,
    starTalkingPoints: {
      situation: 'Full fine-tuning of multi-billion parameter vision-language models for clinical research exceeded single-GPU academic workstation budget.',
      task: 'Build a reproducible PEFT fine-tuning pipeline on a consumer GPU (24GB VRAM) while achieving competitive accuracy with full-weight fine-tuning.',
      action: 'Implemented QLoRA using bitsandbytes NF4 quantization and double quantization; curated 12,000 paired X-ray caption examples and tracked loss with W&B.',
      result: 'Completed training on a single RTX 3090 in 8 hours. Reached 78.4% diagnostic accuracy (+14.2% over base zero-shot) using only 18.5GB VRAM.',
    },
    deliverables: [
      { id: 'd10', text: 'Dataset preprocessing & medical entity cleaning', completed: true },
      { id: 'd11', text: 'QLoRA training harness with gradient checkpointing', completed: true },
      { id: 'd12', text: 'Evaluation script with clinical terminology metric', completed: false },
      { id: 'd13', text: 'Model weights exported to Hugging Face Hub format', completed: false },
    ],
    evalMetrics: [
      { name: 'Diagnostic Accuracy', value: '78.4%', baseline: '64.2%' },
      { name: 'Peak GPU VRAM', value: '18.5 GB', baseline: '>48 GB (Full)' },
    ],
    updatedAt: '2026-10-17T11:00:00Z',
  },
  {
    id: 'proj-4',
    title: 'Streaming Real-Time Voice Agent with Sub-800ms End-to-End Latency',
    oneLiner: 'Ultra-low latency conversational assistant orchestrating streaming ASR, token-by-token LLM generation, and streaming TTS over WebSockets.',
    status: 'concept',
    category: 'ai_agents',
    techStack: ['Python', 'WebSockets', 'Whisper.cpp', 'FastAPI', 'Edge-TTS', 'AsyncIO'],
    githubUrl: 'https://github.com/aspiring-ai-eng/voice-agent-streaming',
    problemStatement: 'Turn-based voice bots with sequential Audio -> Speech-to-Text -> LLM -> Text-to-Speech suffer from 3-5 second delays, ruining conversation naturalness.',
    architectureNotes: `1. Audio Stream: Client microphone sends 16kHz PCM audio chunks over duplex WebSocket.
2. Streaming ASR: Voice Activity Detection (Silero VAD) detects speech boundaries; streaming Whisper.cpp transcribes in 200ms windows.
3. Sentence Boundary Buffer: As LLM emits tokens, a sentence chunker passes complete clauses immediately to the TTS synthesizer before the full response finishes.
4. Barge-In Interruption: If user starts speaking while assistant audio plays, client notifies server to cancel inflight LLM generation immediately.`,
    starTalkingPoints: {
      situation: 'Traditional voice assistants feel unnatural due to multi-second silence while waiting for complete transcriptions and responses.',
      task: 'Design an architecture where the user hears spoken responses within 800ms of finishing their sentence, supporting natural interruptions.',
      action: 'Engineered a pipelined streaming architecture over bidirectional WebSockets that overlaps transcription, generation, and synthesis concurrently.',
      result: 'Demonstrated average conversational turn-around time of 680ms with seamless barge-in support.',
    },
    deliverables: [
      { id: 'd14', text: 'Duplex WebSocket audio streaming client & server', completed: false },
      { id: 'd15', text: 'Voice Activity Detection (VAD) buffer pipeline', completed: false },
      { id: 'd16', text: 'Streaming token chunker to TTS audio generator', completed: false },
    ],
    evalMetrics: [
      { name: 'End-to-End Latency', value: '680ms', baseline: '3200ms' },
    ],
    updatedAt: '2026-10-15T09:00:00Z',
  },
];

export const INITIAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q-1',
    question: 'Explain how FlashAttention achieves exact attention speedup without approximating softmax.',
    category: 'llm_internals',
    difficulty: 'Senior/Staff',
    summary: 'FlashAttention is IO-aware: it tiles Q, K, V into fast GPU SRAM and uses the online softmax algorithm to compute exact attention without materializing the N x N attention matrix in slow HBM.',
    detailedAnswer: `Standard attention calculates:
1. S = Q * K^T (N x N matrix written to slow GPU HBM memory)
2. P = softmax(S) (Read from HBM, computed, written back to HBM)
3. O = P * V (Read from HBM, multiplied by V)

For sequence length N=8192, S is 8192 x 8192 (~67M floats per head). Writing and reading this matrix to HBM causes memory bandwidth bottlenecks.

FlashAttention's key innovations:
1. Tiling: Divides Q into blocks of size B_r and K, V into blocks of size B_c that fit directly inside fast on-chip SRAM (~100KB per SM, 19TB/s bandwidth vs ~2TB/s for HBM).
2. Online Softmax: Softmax requires the maximum value and normalizer sum across the entire row. FlashAttention uses Milakov & Gimelshein's online softmax formulation, maintaining running maximum m_i and running sum l_i to rescale intermediate results dynamically as new blocks arrive.
3. Recomputation in Backward Pass: Rather than storing the N x N attention matrix P for backpropagation (which consumes enormous memory), it only stores the output O and the softmax statistics (m_i, l_i), and recomputes the small SRAM tiles on the fly during the backward pass.

Result: Exact numerical equivalence, O(N) memory complexity instead of O(N^2), and 2-4x wall-clock speedup.`,
    keyTakeaways: [
      'IO-aware algorithm targeting memory bandwidth bottlenecks, not FLOP count.',
      'Uses online softmax to accumulate results in SRAM without materializing N x N matrix.',
      'Recomputes attention tiles in backward pass, reducing memory from quadratic to linear.',
    ],
    commonPitfalls: [
      'Confusing FlashAttention with approximate attention methods (e.g. Linformer, Reformer); FlashAttention is 100% exact mathematically.',
      'Thinking FlashAttention reduces compute FLOPs; it actually does slightly more FLOPs in backward pass but runs much faster due to SRAM memory bandwidth.',
    ],
    mastery: 'familiar',
    reviewCount: 2,
    lastReviewedAt: '2026-10-19T17:00:00Z',
    isBookmarked: true,
  },
  {
    id: 'q-2',
    question: 'How do you calculate the exact VRAM footprint of the KV Cache during autoregressive generation?',
    category: 'llm_internals',
    difficulty: 'Mid',
    summary: 'KV Cache size = 2 * num_layers * num_kv_heads * head_dim * seq_len * bytes_per_element * batch_size.',
    detailedAnswer: `For every token generated, we must keep the Key and Value vectors for all past tokens to compute attention without recomputing past states.

Formula:
VRAM_bytes = 2 * L * H_kv * d_h * S * B * P
Where:
- 2: Keys and Values (one tensor each)
- L: Number of Transformer layers
- H_kv: Number of KV heads (equal to attention heads in MHA; smaller in GQA/MQA)
- d_h: Dimension per head (usually hidden_size / num_attention_heads)
- S: Sequence length (prompt tokens + generated tokens)
- B: Batch size
- P: Precision in bytes (2 for FP16/BF16, 1 for INT8, 0.5 for FP4)

Example: Llama 3 8B (L=32 layers, GQA with 8 KV heads, d_h=128, BF16 P=2 bytes)
Per token per sequence:
2 * 32 * 8 * 128 * 2 = 131,072 bytes ≈ 128 KB per token.
For 1 sequence of 8,192 tokens:
128 KB * 8,192 = 1,048,576 KB = 1 GB VRAM per user stream!
At batch size 32, the KV cache alone requires 32 GB VRAM.

Comparison with Multi-Head Attention (MHA):
If Llama 3 used MHA (32 KV heads), KV cache would be 4x larger: 4 GB per user, 128 GB for batch size 32. Grouped Query Attention (GQA) is what makes high-concurrency LLM serving practical.`,
    keyTakeaways: [
      'Know the parameters: 2 * L * H_kv * d_h * S * B * bytes.',
      'Understand how GQA (Grouped Query Attention) dramatically reduces KV cache footprint.',
      'Explain that at long context (8k-32k), KV cache often exceeds model weight VRAM.',
    ],
    commonPitfalls: [
      'Forgetting that GQA has fewer KV heads than Query heads (using H_q instead of H_kv).',
      'Forgetting the multiplier 2 for both Keys AND Values.',
      'Overlooking activation memory and CUDA workspace overhead.',
    ],
    mastery: 'mastered',
    reviewCount: 4,
    lastReviewedAt: '2026-10-18T16:00:00Z',
    isBookmarked: true,
  },
  {
    id: 'q-3',
    question: 'Design an Enterprise RAG System: How do you solve retrieval failure for domain acronyms and vague queries?',
    category: 'system_design',
    difficulty: 'Senior/Staff',
    summary: 'Employ a multi-stage architecture: Query Expansion (HyDE / Multi-Query) -> Hybrid Retrieval (Dense Vector + Sparse BM25/SPLADE via RRF) -> Cross-Encoder Reranking -> Self-Reflection Guardrail.',
    detailedAnswer: `Step 1: Ingestion & Indexing
- Semantic Chunking: Break text based on sentence embedding similarity boundaries rather than fixed token splits.
- Dual Indexing: Store dense embeddings (e.g. BGE-large or text-embedding-3-large) for conceptual similarity AND sparse inverted index (BM25 or SPLADE) for exact part numbers, error codes, and acronyms.

Step 2: Query Transformation
- Hypothetical Document Embeddings (HyDE): For short, vague questions, prompt a fast LLM to generate a hypothetical answer. Embed the hypothetical answer instead of the query to match document feature spaces.
- Multi-Query Expansion: Decompose compound queries into sub-queries.

Step 3: Two-Stage Hybrid Retrieval
- Fetch top 50 candidates from Dense Vector DB.
- Fetch top 50 candidates from Sparse BM25.
- Fuse candidates using Reciprocal Rank Fusion (RRF):
  RRF_score(d) = sum(1 / (k + rank_i(d))) with k=60.

Step 4: Cross-Encoder Reranker
- Bi-encoders compress docs into a single vector (losing token-level cross-interaction).
- A Cross-Encoder (e.g., bge-reranker-large) feeds (Query, Chunk) together through full attention layers, producing an authentic relevance score.
- Filter top 50 down to the top 5 most relevant passages.

Step 5: Hallucination & Factuality Guardrail
- Use structured prompt: require explicit citation tags [Doc 1].
- Run a lightweight validation check: if document relevance < threshold, gracefully refuse or trigger web search instead of hallucinating.`,
    keyTakeaways: [
      'Dense embeddings struggle with rare tokens, IDs, and domain acronyms; sparse search (BM25) solves this.',
      'Bi-encoders are fast for search; cross-encoders are accurate for reranking.',
      'HyDE and query expansion bridge the semantic gap between questions and answers.',
    ],
    commonPitfalls: [
      'Suggesting only naive vector search with cosine similarity.',
      'Reranking 1,000 documents with a slow cross-encoder (high latency bottleneck).',
      'Failing to specify how chunks are constructed and cleaned.',
    ],
    mastery: 'needs_practice',
    reviewCount: 1,
    lastReviewedAt: '2026-10-16T12:00:00Z',
    isBookmarked: false,
  },
  {
    id: 'q-4',
    question: 'What is the difference between LoRA and QLoRA, and how does Low-Rank Adaptation work mathematically?',
    category: 'llm_internals',
    difficulty: 'Mid',
    summary: 'LoRA freezes base weights W0 and decomposes weight updates into two low-rank matrices W = W0 + (alpha/r) * (B * A). QLoRA quantizes W0 to 4-bit NormalFloat with double quantization and paged optimizers.',
    detailedAnswer: `Mathematical Formulation of LoRA:
For a dense layer with weight matrix W0 in R^(d x k):
Instead of updating all d * k parameters:
W = W0 + Delta_W
Delta_W is factorized as:
Delta_W = (alpha / r) * (B * A)
Where:
- A in R^(r x k), initialized with Gaussian distribution.
- B in R^(d x r), initialized to 0 (so Delta_W = 0 at start).
- r: Rank hyperparameter (e.g., r=8 or r=16), where r << min(d, k).
- alpha: Scaling constant (usually 2 * r or equal to r).

Parameter Reduction:
If d=4096, k=4096:
Full weights: 4096 * 4096 ≈ 16.7M parameters.
LoRA with r=16: (4096 * 16) + (16 * 4096) = 131,072 parameters (99.2% reduction!).

What QLoRA Adds:
1. 4-bit NormalFloat (NF4): An information-theoretically optimal quantile quantization for normally distributed weights.
2. Double Quantization (DQ): Quantizes the quantization constants themselves, saving ~0.37 bits per parameter (~3GB on a 65B model).
3. Paged Optimizers: Uses CUDA Unified Memory to automatically page optimizer states to CPU RAM during memory spikes, preventing OOM crashes.
4. Computation precision: Base weights stored in 4-bit NF4, but dequantized to BF16/FP16 on the fly in SRAM during forward and backward passes.`,
    keyTakeaways: [
      'LoRA represents delta weights as BA where rank r is small; zero initialization of B ensures initial equivalence.',
      'QLoRA enables fine-tuning 70B models on a single 48GB GPU or 7B models on a 16GB GPU.',
      'Dequantization happens in SRAM, retaining FP16/BF16 gradient precision.',
    ],
    commonPitfalls: [
      'Thinking QLoRA trains in 4-bit gradients; weights are stored in 4-bit, but compute is performed in 16-bit.',
      'Forgetting the scaling factor alpha/r in the forward pass.',
      'Applying LoRA only to q_proj and v_proj when modern research shows adapting all linear layers yields better performance.',
    ],
    mastery: 'mastered',
    reviewCount: 3,
    lastReviewedAt: '2026-10-18T19:00:00Z',
    isBookmarked: true,
  },
  {
    id: 'q-5',
    question: 'How do you detect, evaluate, and mitigate LLM hallucinations in a production deployment?',
    category: 'mlops_eval',
    difficulty: 'Senior/Staff',
    summary: 'Use a layered defense: Strict prompt grounding with citations, automated evaluation frameworks (RAGAS/TruLens for Faithfulness & Answer Relevance), logit uncertainty/entropy estimation, and automated guardrail evaluators.',
    detailedAnswer: `Detection & Evaluation Metrics:
1. Faithfulness / Groundedness: Measures whether every statement in the LLM output can be directly inferred from the retrieved context. Computed via LLM-as-a-judge by extracting atomic claims and checking evidence entailing each claim.
2. Answer Relevance: Checks if the response addresses the user prompt without tangent hallucinations.
3. Context Precision & Recall: Evaluates if relevant ground-truth information was present in the top chunks.
4. Token Probability / Entropy: Measuring the average token log-likelihood or semantic entropy across multiple sample paths (Kuhn et al., Nature 2023). High entropy indicates the model is guessing facts.

Mitigation in Production:
1. Prompt Construction: Force citation tagging ([1], [2]). Instruct model: "If the context does not explicitly state the answer, state that information is unavailable."
2. Chain of Verification (CoVe): Have the model generate claims, formulate verification questions for each claim, execute search, and produce a corrected final output.
3. Deterministic Guardrails: NeMo Guardrails or Llama Guard running parallel checks before releasing tokens to the user.
4. Structured Outputs: Constrain output grammar (JSON schema with Pydantic) to eliminate conversational drift.`,
    keyTakeaways: [
      'Deconstruct hallucination into Faithfulness (evidence match) vs Relevance (prompt answer).',
      'LLM-as-a-judge claim extraction is industry standard for RAG evaluation.',
      'Logit entropy / sample disagreement provides model-level uncertainty signals.',
    ],
    commonPitfalls: [
      'Assuming temperature=0 completely eliminates hallucinations (it does not; it only makes generation deterministic).',
      'Using BLEU or ROUGE to evaluate factual accuracy; they only measure n-gram overlap, not semantic truth.',
    ],
    mastery: 'familiar',
    reviewCount: 2,
    lastReviewedAt: '2026-10-15T15:00:00Z',
    isBookmarked: false,
  },
  {
    id: 'q-6',
    question: 'Write the PyTorch forward pass for Scaled Dot-Product Attention from scratch with casual masking.',
    category: 'coding_pytorch',
    difficulty: 'Mid',
    summary: 'Attention(Q, K, V) = softmax((Q @ K.T) / sqrt(d_k) + mask) @ V.',
    detailedAnswer: `PyTorch Implementation:

\`\`\`python
import torch
import torch.nn as nn
import math

def scaled_dot_product_attention(q, k, v, mask=None):
    """
    Args:
        q: [batch_size, num_heads, seq_len_q, head_dim]
        k: [batch_size, num_heads, seq_len_k, head_dim]
        v: [batch_size, num_heads, seq_len_v, head_dim]
        mask: boolean or additive tensor broadcastable to [batch, num_heads, seq_len_q, seq_len_k]
    Returns:
        output: [batch_size, num_heads, seq_len_q, head_dim]
        attn_weights: [batch_size, num_heads, seq_len_q, seq_len_k]
    """
    d_k = q.size(-1)
    
    # 1. Compute dot product: Q @ K^T -> [B, H, S_q, S_k]
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    
    # 2. Apply causal mask (if autoregressive decoder)
    if mask is not None:
        # mask is True where we want to keep, False where we want to mask
        scores = scores.masked_fill(mask == 0, float('-inf'))
        
    # 3. Softmax over the last dimension (keys dimension)
    attn_weights = torch.softmax(scores, dim=-1)
    
    # 4. Multiply by Value: -> [B, H, S_q, head_dim]
    output = torch.matmul(attn_weights, v)
    
    return output, attn_weights
\`\`\`

Whiteboard Discussion Points:
- Scaling by sqrt(d_k): For large head dimensions, dot products grow large in magnitude, pushing softmax into regions with tiny gradients (gradient vanishing). Scaling preserves unit variance.
- Numerical stability: PyTorch's internal softmax subtracts the max value per row automatically to prevent overflow.`,
    keyTakeaways: [
      'Multiply Q with K transposed on last two dims (-2, -1).',
      'Scale by 1 / sqrt(d_k) before softmax to avoid vanishing gradients.',
      'Fill masked positions with -inf so softmax yields exactly 0 attention probability.',
    ],
    commonPitfalls: [
      'Transposing wrong dimensions (transposing batch or heads instead of -2 and -1).',
      'Softmax along wrong dimension (must be dim=-1).',
      'Forgetting the scaling factor sqrt(d_k).',
    ],
    mastery: 'familiar',
    reviewCount: 3,
    lastReviewedAt: '2026-10-19T10:00:00Z',
    isBookmarked: true,
  },
  {
    id: 'q-7',
    question: 'Describe a time you encountered a severe training failure or loss explosion. How did you diagnose and fix it?',
    category: 'behavioral',
    difficulty: 'Mid',
    summary: 'Framework: STAR. Highlight data inspection, gradient norm telemetry, learning rate warmup, FP16 vs BF16 numerical underflow, and systematic ablation.',
    detailedAnswer: `Example Model Answer:

Situation:
While fine-tuning an 8B language model on domain code-generation data using QLoRA with deepspeed ZeRO-2, training was stable for 600 steps before suddenly suffering NaN loss and gradient divergence at step 620.

Task:
I needed to identify the root cause without wasting expensive GPU compute hours, implement safeguards, and recover the training run.

Action:
1. Checked Gradient Norms & Activations: W&B logs showed gradient norms spiked from 0.8 to 450+ right before the NaN crash.
2. Isolated the Batch: Pulled the exact data sample fed into step 620. Found an outlier scraping artifact containing 4,000 repeated null byte characters, causing attention weights to divide by zero in the tokenizer layer.
3. Fixed Precision & LayerNorm Underflow: We were training in FP16; the small epsilon in LayerNorm (1e-5) suffered underflow when activations scaled. I converted the training configuration to native BF16, which has the same dynamic range as FP32 (8 exponent bits).
4. Added Gradient Clipping & Length Filtering: Set max_grad_norm=1.0 and added data hygiene filters to reject repetitive token sequences.

Result:
Resumed from step 600 checkpoint; the training completed all 3,000 steps smoothly. The resulting model beat baseline on HumanEval by 8.5% with zero further divergence.`,
    keyTakeaways: [
      'Show structured debugging: telemetry -> data isolation -> precision analysis -> preventative safeguards.',
      'Explain the difference between FP16 (narrow dynamic range, underflow risk) and BF16 (wide dynamic range).',
      'Demonstrate ownership and quantitative business/technical outcome.',
    ],
    commonPitfalls: [
      'Saying "I just reduced the learning rate" without investigating the actual cause.',
      'Blaming external libraries without demonstrating root-cause comprehension.',
    ],
    mastery: 'needs_practice',
    reviewCount: 1,
    lastReviewedAt: '2026-10-17T15:00:00Z',
    isBookmarked: false,
  },
  {
    id: 'q-8',
    question: 'Compare DPO (Direct Preference Optimization) with PPO for RLHF alignment. Why is DPO widely preferred today?',
    category: 'llm_internals',
    difficulty: 'Senior/Staff',
    summary: 'PPO requires training 4 separate models (Actor, Critic, Reference, Reward) with tricky reinforcement learning stability; DPO analytically proves the optimal policy can be derived directly from preference pairs using a closed-form loss.',
    detailedAnswer: `PPO (Proximal Policy Optimization) in RLHF:
Requires 4 active models in GPU VRAM during training:
1. Actor (Policy model being updated)
2. Critic / Value model (predicts expected future rewards)
3. Reference model (frozen baseline to compute KL penalty)
4. Reward model (scores generated sequences)
Issues: Massive GPU memory requirements, unstable RL training dynamics, sensitive reward hacking, difficult hyperparameter tuning (learning rate, KL coefficient, clip ratio).

DPO (Direct Preference Optimization - Rafailov et al., 2023):
Key Insight: The Bradley-Terry reward model can be mathematically reparameterized directly in terms of the optimal policy probability ratio:
r(x, y) = beta * log(pi_theta(y|x) / pi_ref(y|x))

Instead of training a separate reward model and doing RL exploration:
DPO minimizes a binary cross-entropy loss directly on preference pairs (prompt x, chosen answer y_w, rejected answer y_l):
L_DPO = -E [ log sigma( beta * log(pi_theta(y_w|x) / pi_ref(y_w|x)) - beta * log(pi_theta(y_l|x) / pi_ref(y_l|x)) ) ]

Benefits of DPO:
1. Only requires 2 models in VRAM (Policy and frozen Reference).
2. Supervised classification loss — stable gradient descent with no reinforcement learning variance.
3. No sampling loop during training; operates directly on offline paired datasets.`,
    keyTakeaways: [
      'DPO reparameterizes the reward function using the policy itself, bypassing RL completely.',
      'Saves huge VRAM (no critic or reward model during policy training).',
      'Much more stable to train than PPO, leading to widespread adoption (Llama 3, Zephyr, Mistral).',
    ],
    commonPitfalls: [
      'Thinking DPO does not need a reference model; it still needs pi_ref to enforce the implicit KL penalty.',
      'Believing DPO cannot suffer from overfitting; without proper beta regularization, it can degrade generation diversity.',
    ],
    mastery: 'unstudied',
    reviewCount: 0,
    isBookmarked: true,
  },
];

export const INITIAL_SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'track-llm',
    title: 'Transformer & LLM Internals',
    description: 'Core architectural components of decoder-only and encoder-decoder models.',
    items: [
      {
        id: 'skill-mha',
        trackId: 'track-llm',
        name: 'Attention Mechanisms (MHA, GQA, MQA)',
        description: 'Multi-head, grouped-query, and multi-query attention arithmetic & memory tradeoffs.',
        level: 4,
        targetLevel: 5,
        coreConcepts: ['Scaled Dot-Product', 'GQA KV Head Sharing', 'Query Projection', 'FlashAttention Tiling'],
      },
      {
        id: 'skill-pos-emb',
        trackId: 'track-llm',
        name: 'Positional Embeddings & Context Length',
        description: 'RoPE, ALiBi, Sinusoidal, YaRN context extension, and frequency base scaling.',
        level: 3,
        targetLevel: 4,
        coreConcepts: ['Complex Plane Rotation', 'NTK-Aware Scaling', 'Length Generalization', 'Frequency Matrix'],
      },
      {
        id: 'skill-sampling',
        trackId: 'track-llm',
        name: 'Decoding & Sampling Strategies',
        description: 'Greedy, Temperature, Top-K, Top-P (Nucleus), Min-P, and Speculative Decoding.',
        level: 4,
        targetLevel: 5,
        coreConcepts: ['Logit Temperature Softmax', 'Nucleus Cumulative Cutoff', 'Draft Verification Loop', 'Repetition Penalty'],
      },
    ],
  },
  {
    id: 'track-peft',
    title: 'Fine-Tuning & Alignment',
    description: 'Adapting foundation models with parameter-efficient techniques and alignment algorithms.',
    items: [
      {
        id: 'skill-lora',
        trackId: 'track-peft',
        name: 'PEFT (LoRA & QLoRA)',
        description: 'Low-rank matrix factorization, NF4 quantization, and adapter merging.',
        level: 4,
        targetLevel: 5,
        coreConcepts: ['Rank r & Alpha Scaling', 'NormalFloat4 Quantization', 'Gradient Checkpointing', 'Merged Weights'],
      },
      {
        id: 'skill-alignment',
        trackId: 'track-peft',
        name: 'RLHF & Preference Alignment',
        description: 'DPO, PPO, KTO, ORPO, reward modeling, and instruction tuning data curation.',
        level: 3,
        targetLevel: 4,
        coreConcepts: ['Bradley-Terry Model', 'DPO Loss Derivation', 'Reference Model KL Penalty', 'Synthetic Data Filtering'],
      },
      {
        id: 'skill-data-curation',
        trackId: 'track-peft',
        name: 'Instruction & Synthetic Data Pipelines',
        description: 'Self-Instruct, Evol-Instruct, decontamination, and quality filtering.',
        level: 3,
        targetLevel: 4,
        coreConcepts: ['Semantic Deduplication', 'LLM-as-Judge Filtering', 'Prompt Variation', 'Benchmark Decontamination'],
      },
    ],
  },
  {
    id: 'track-rag',
    title: 'RAG & AI Agent Architectures',
    description: 'Knowledge retrieval, embedding representations, and autonomous tool-using agents.',
    items: [
      {
        id: 'skill-retrieval',
        trackId: 'track-rag',
        name: 'Hybrid Search & Retrieval Optimization',
        description: 'Dense vector search, sparse BM25, SPLADE, and Reciprocal Rank Fusion (RRF).',
        level: 4,
        targetLevel: 5,
        coreConcepts: ['Bi-Encoder vs Cross-Encoder', 'RRF k-constant', 'HNSW vs IVF Indexing', 'Metadata Filtering'],
      },
      {
        id: 'skill-chunking',
        trackId: 'track-rag',
        name: 'Chunking & Query Expansion',
        description: 'Semantic chunking, HyDE, Multi-Query expansion, and contextual compression.',
        level: 4,
        targetLevel: 4,
        coreConcepts: ['Sentence Boundary Detection', 'Parent-Child Document Indexing', 'Hypothetical Embeddings'],
      },
      {
        id: 'skill-agents',
        trackId: 'track-rag',
        name: 'Agentic Tool Calling & Graph Workflows',
        description: 'ReAct pattern, LangGraph cyclic state machines, function calling schemas, and error recovery.',
        level: 3,
        targetLevel: 5,
        coreConcepts: ['ReAct Thought-Action-Observation', 'Structured Tool Schemas', 'Cyclic Execution Loops', 'State Persistence'],
      },
    ],
  },
  {
    id: 'track-serving',
    title: 'Inference, Serving & MLOps',
    description: 'High-throughput deployment, hardware acceleration, and production reliability.',
    items: [
      {
        id: 'skill-vllm',
        trackId: 'track-serving',
        name: 'vLLM & Continuous Batching',
        description: 'PagedAttention, iteration-level scheduling, and chunked prefill.',
        level: 3,
        targetLevel: 5,
        coreConcepts: ['PagedAttention Block Tables', 'Continuous Batching', 'Prefix Caching', 'TTFT vs TPOT'],
      },
      {
        id: 'skill-quant',
        trackId: 'track-serving',
        name: 'Model Quantization (AWQ, GPTQ, GGUF, FP8)',
        description: 'Post-training quantization methods, activation outlier protection, and hardware support.',
        level: 3,
        targetLevel: 4,
        coreConcepts: ['Weight-Only vs Weight-Activation', 'Salient Weight Protection (AWQ)', 'FP8 E4M3 vs E5M2', 'Per-Channel Scaling'],
      },
      {
        id: 'skill-eval',
        trackId: 'track-serving',
        name: 'LLM Evaluation & Observability',
        description: 'RAGAS, TruLens, Prometheus metrics, and automated regression benchmarking.',
        level: 3,
        targetLevel: 4,
        coreConcepts: ['Faithfulness & Answer Relevance', 'GPU VRAM & Utilization Metrics', 'Golden Dataset Curation'],
      },
    ],
  },
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  { id: 's-1', date: '2026-10-18', minutes: 50, activity: 'Portfolio Coding', notes: 'Implemented hybrid BM25 + Qdrant search fusion in agentic RAG.' },
  { id: 's-2', date: '2026-10-19', minutes: 35, activity: 'Interview Flashcards', notes: 'Mastered FlashAttention online softmax derivation.' },
  { id: 's-3', date: '2026-10-20', minutes: 45, activity: 'Paper Review', notes: 'Read QLoRA paper and wrote math notes on NF4 quantization.' },
];
