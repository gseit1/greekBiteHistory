<template>
  <div id="app">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1 class="hero-title">🏛️ Mini Greek History Bites</h1>
            <p class="hero-subtitle">
              Discover fascinating Greek history in bite-sized stories. 
              Get 2 curated stories daily to expand your knowledge of Greece's rich heritage.
            </p>
            <div class="hero-features">
              <span class="hero-feature">
                <i class="bi bi-calendar-day"></i>
                2 Daily Stories
              </span>
              <span class="hero-feature">
                <i class="bi bi-phone"></i>
                Mobile Friendly
              </span>
              <span class="hero-feature">
                <i class="bi bi-clock"></i>
                2-3 Min Reads
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Daily Bites Section -->
    <section class="daily-bites-section">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="daily-bites-card">
              <div class="daily-header">
                <div class="daily-icon">
                  <i class="bi bi-calendar-day"></i>
                </div>
                <div class="daily-content">
                  <h2 class="daily-title">📚 Today's History Bites</h2>
                  <p class="daily-subtitle">{{ getCurrentDateFormatted() }} • 2 stories to expand your knowledge</p>
                </div>
              </div>
              
              <div class="row">
                <div 
                  v-for="story in dailyStories" 
                  :key="story.id"
                  class="col-md-6"
                >
                  <div class="daily-story-card">
                    <div class="daily-story-badge">
                      <span>Daily Pick</span>
                    </div>
                    <div class="daily-story-era">{{ story.era }}</div>
                    <h4 class="daily-story-title">{{ story.title }}</h4>
                    <p class="daily-story-preview">{{ story.preview }}</p>
                    
                    <!-- Show full content if expanded -->
                    <div v-if="expandedStories.includes(story.id)" class="daily-story-content">
                      <div class="story-divider"></div>
                      <p class="daily-story-text">{{ story.content }}</p>
                      <div class="story-read-time">
                        <i class="bi bi-clock"></i>
                        {{ story.readTime }} min read
                      </div>
                    </div>
                    
                    <button 
                      @click="toggleStory(story.id)"
                      class="daily-read-btn"
                    >
                      <i class="bi bi-book"></i>
                      {{ expandedStories.includes(story.id) ? 'Collapse Story' : 'Read Today\'s Bite' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mx-auto">
            <input 
              v-model="searchQuery"
              type="text" 
              class="form-control search-input" 
              placeholder="Search Greek history stories..."
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="filter-section">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <!-- Era Filters -->
            <div class="text-center mb-3">
              <button 
                v-for="era in eras" 
                :key="era"
                @click="activeFilter = era; currentPage = 1"
                :class="['btn', 'filter-btn', { 
                  active: activeFilter === era,
                  'daily-filter': era === 'Daily'
                }]"
              >
                <i v-if="era === 'Daily'" class="bi bi-star-fill me-1"></i>
                {{ era }}
              </button>
            </div>
            
            <!-- Advanced Controls -->
            <div class="row align-items-center">
              <div class="col-md-4">
                <div class="sort-controls">
                  <label class="sort-label">
                    <i class="bi bi-sort-down"></i>
                    Sort by:
                  </label>
                  <select v-model="sortBy" @change="currentPage = 1" class="form-select sort-select">
                    <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="col-md-4 text-center">
                <div class="view-controls">
                  <button 
                    @click="viewMode = 'pagination'; currentPage = 1"
                    :class="['btn', 'view-btn', { active: viewMode === 'pagination' }]"
                    title="Pagination View"
                  >
                    <i class="bi bi-grid-3x3-gap"></i>
                    Pages
                  </button>
                  <button 
                    @click="viewMode = 'infinite'"
                    :class="['btn', 'view-btn', { active: viewMode === 'infinite' }]"
                    title="Infinite Scroll"
                  >
                    <i class="bi bi-arrow-down-circle"></i>
                    Scroll
                  </button>
                </div>
              </div>
              
              <div class="col-md-4 text-end">
                <div class="results-info">
                  <span class="results-count">
                    <i class="bi bi-bookmarks"></i>
                    {{ displayedStories.length }} of {{ totalFilteredStories }} stories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stories Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div v-if="loading" class="loading">
              <div class="spinner"></div>
            </div>
            
            <div v-else-if="filteredStories.length === 0" class="empty-state">
              <i class="bi bi-search"></i>
              <h3>No stories found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
            
            <div v-else class="row">
              <div 
                v-for="story in displayedStories" 
                :key="story.id"
                :data-story-id="story.id"
                class="col-lg-6 col-xl-4"
              >
                <div class="story-card fade-in">
                  <div v-if="isDailyStory(story.id)" class="daily-story-indicator">
                    <i class="bi bi-star-fill"></i>
                    Today's Pick
                  </div>
                  <div class="story-header">
                    <span class="story-era">{{ story.era }}</span>
                    <h3 class="story-title">{{ story.title }}</h3>
                    <p class="story-preview">{{ story.preview }}</p>
                  </div>
                  
                  <div v-if="expandedStories.includes(story.id)" class="story-content">
                    <p class="story-text">{{ story.content }}</p>
                  </div>
                  
                  <div class="story-footer">
                    <span class="read-time">
                      <i class="bi bi-clock"></i>
                      {{ story.readTime }} min read
                    </span>
                    <button 
                      @click="toggleStory(story.id)"
                      class="expand-btn"
                    >
                      <span>{{ expandedStories.includes(story.id) ? 'Read Less' : 'Read More' }}</span>
                      <i :class="['bi', expandedStories.includes(story.id) ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination Controls -->
            <div v-if="viewMode === 'pagination' && totalPages > 1" class="pagination-section">
              <nav aria-label="Stories pagination">
                <ul class="pagination-controls">
                  <li>
                    <button 
                      @click="goToPage(1)"
                      :disabled="currentPage === 1"
                      class="pagination-btn"
                      title="First Page"
                    >
                      <i class="bi bi-chevron-double-left"></i>
                    </button>
                  </li>
                  <li>
                    <button 
                      @click="goToPage(currentPage - 1)"
                      :disabled="currentPage === 1"
                      class="pagination-btn"
                      title="Previous Page"
                    >
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  <li v-for="page in visiblePages" :key="page">
                    <button 
                      v-if="page !== '...'"
                      @click="goToPage(page)"
                      :class="['pagination-btn', 'page-number', { active: currentPage === page }]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="pagination-dots">...</span>
                  </li>
                  
                  <li>
                    <button 
                      @click="goToPage(currentPage + 1)"
                      :disabled="currentPage === totalPages"
                      class="pagination-btn"
                      title="Next Page"
                    >
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                  <li>
                    <button 
                      @click="goToPage(totalPages)"
                      :disabled="currentPage === totalPages"
                      class="pagination-btn"
                      title="Last Page"
                    >
                      <i class="bi bi-chevron-double-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }}
              </div>
            </div>
            
            <!-- Load More Button for Infinite Scroll -->
            <div v-if="viewMode === 'infinite' && hasMoreStories" class="load-more-section">
              <button 
                @click="loadMoreStories"
                :disabled="loadingMore"
                class="load-more-btn"
              >
                <div v-if="loadingMore" class="loading-spinner">
                  <div class="spinner-mini"></div>
                  Loading more stories...
                </div>
                <div v-else class="load-more-content">
                  <i class="bi bi-plus-circle"></i>
                  Load {{ Math.min(storiesPerPage, totalFilteredStories - displayedStories.length) }} More Stories
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <p class="mb-0">
              <i class="bi bi-heart-fill text-danger"></i>
              Made with love for Greek history enthusiasts
            </p>
            <small class="text-muted">© 2025 Mini Greek History Bites</small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const loading = ref(true)
    const searchQuery = ref('')
    const activeFilter = ref('All')
    const expandedStories = ref([])
    const dailyStories = ref([])
    const currentPage = ref(1)
    const storiesPerPage = ref(6)
    const sortBy = ref('default')
    const viewMode = ref('pagination') // 'pagination' or 'infinite'
    const loadingMore = ref(false)
    
    const eras = ['All', 'Daily', 'Ancient', 'Byzantine', 'Ottoman', 'Modern', 'Obscure']
    const sortOptions = [
      { value: 'default', label: 'Default Order' },
      { value: 'title', label: 'Title A-Z' },
      { value: 'era', label: 'Era' },
      { value: 'readTime', label: 'Read Time' },
      { value: 'newest', label: 'Newest First' }
    ]
    
    const stories = ref([
      {
        id: 1,
        title: "Why Are Greek Taxis Yellow?",
        era: "Modern",
        preview: "The surprising reason behind Greece's iconic yellow taxi fleet dates back to a practical decision in the 1980s...",
        content: "In 1980, the Greek government mandated that all taxis in Athens be painted yellow for a very practical reason: visibility and safety. The bright yellow color was chosen because it's easily recognizable both day and night, making it safer for passengers to identify legitimate taxis. This decision came after a period when taxis were various colors, leading to confusion and some safety concerns. The yellow color also became a symbol of Athens' urban landscape, creating a unified visual identity for the city's transportation system. Interestingly, the specific shade of yellow was carefully selected to be visible even in Greece's bright Mediterranean sunlight, ensuring maximum safety and recognition for both locals and tourists.",
        readTime: 2
      },
      {
        id: 2,
        title: "Who Was Theodoros Kolokotronis?",
        era: "Modern",
        preview: "The legendary general who became known as the 'Old Man of the Morea' during Greece's War of Independence...",
        content: "Theodoros Kolokotronis (1770-1843) was arguably the most important military leader of the Greek War of Independence. Born in Ramavouni, Messenia, he became known as 'Ο Γέρος του Μοριά' (The Old Man of the Morea). His guerrilla warfare tactics against the Ottoman Empire were revolutionary for their time. Kolokotronis had spent years fighting alongside the British in the Ionian Islands, gaining valuable military experience. When the Greek Revolution began in 1821, he returned to lead the fight in the Peloponnese. His most famous victory was the siege of Tripolitsa in 1821, which became a turning point in the war. Despite his military genius, he also faced political challenges and was even imprisoned by rival Greek factions. His autobiography remains one of the most important historical documents of the period.",
        readTime: 3
      },
      {
        id: 3,
        title: "The Mystery of the Antikythera Mechanism",
        era: "Ancient",
        preview: "Discovered in a shipwreck, this ancient Greek device has been called the world's first computer...",
        content: "The Antikythera Mechanism, dating from around 100-50 BCE, is perhaps the most mysterious artifact of ancient Greece. Discovered in 1901 by sponge divers off the Greek island of Antikythera, this bronze device baffled researchers for decades. It contains at least 37 meshing bronze gears and was used to predict astronomical positions and eclipses for calendar and astrological purposes. The mechanism could track the four-year cycle of the Olympic Games and predict solar and lunar eclipses with remarkable accuracy. Recent X-ray analysis has revealed inscriptions that serve as a user's manual, showing that ancient Greeks had far more sophisticated understanding of astronomy and engineering than previously thought. Some researchers call it the world's first analog computer, demonstrating that ancient Greek technology was incredibly advanced.",
        readTime: 3
      },
      {
        id: 4,
        title: "The Last Emperor of Byzantium",
        era: "Byzantine",
        preview: "Constantine XI Palaiologos died defending Constantinople in 1453, marking the end of a thousand-year empire...",
        content: "Constantine XI Palaiologos (1405-1453) was the last Byzantine Emperor, ruling from 1449 until his death during the fall of Constantinople in 1453. When Mehmed II's Ottoman forces besieged the city, Constantine showed remarkable courage, choosing to fight alongside his soldiers rather than flee. On May 29, 1453, as Ottoman forces breached the city walls, Constantine reportedly removed his imperial regalia and fought as an ordinary soldier. His body was never definitively identified among the fallen, adding to his legendary status. Some accounts say he died near the Gate of St. Romanus, defending the city to his last breath. His death marked not just the end of the Byzantine Empire, but the end of a continuous line of Roman rule that had lasted for over 1,400 years. Today, he's remembered as a tragic hero who chose honor over survival.",
        readTime: 3
      },
      {
        id: 5,
        title: "The Secret Language of Tsakonian",
        era: "Obscure",
        preview: "Hidden in the mountains of Peloponnese, a unique Greek dialect preserves linguistic treasures from ancient times...",
        content: "Tsakonian is a unique Greek dialect spoken in parts of the eastern Peloponnese that has fascinated linguists for centuries. Unlike other Greek dialects that evolved from Koine Greek, Tsakonian is believed to be descended directly from ancient Doric Greek. This makes it incredibly valuable for understanding how ancient Greek might have sounded. The language has only a few thousand speakers today, mainly elderly residents in villages around Leonidio and Tyros. What makes Tsakonian special is that it preserves ancient Greek features that disappeared elsewhere over 1,500 years ago. For example, it maintains certain Doric vowel changes and consonant clusters. The language has its own unique vocabulary and grammatical structures. Efforts are being made to preserve it through cultural programs and education, as it represents a direct linguistic link to ancient Greece that exists nowhere else in the world.",
        readTime: 2
      },
      {
        id: 6,
        title: "The Miracle of Greek Fire",
        era: "Byzantine",
        preview: "The secret weapon that saved Constantinople from Arab sieges remains one of history's greatest mysteries...",
        content: "Greek Fire was the Byzantine Empire's secret weapon, a liquid incendiary that could burn on water and was nearly impossible to extinguish. Invented around 670 CE by Callinicus of Heliopolis, it was first used to break the Arab siege of Constantinople in 678 CE. The exact composition remains unknown, as the recipe was one of the most closely guarded state secrets in history. Only the emperor and the chief technicians knew the formula, and it was passed down through generations of the same families. The substance was deployed through bronze tubes mounted on ships or walls, creating jets of fire that could destroy enemy vessels. What made it terrifying was that water only spread it further – only sand, urine, or vinegar could extinguish it. The Byzantines used it successfully for over 800 years, and its psychological impact was as important as its physical destruction. When Constantinople fell in 1453, the secret of Greek Fire died with the empire.",
        readTime: 3
      },
      {
        id: 7,
        title: "The Dance of Death: Karagiozis During Ottoman Rule",
        era: "Ottoman",
        preview: "How a shadow puppet became a symbol of Greek resistance and humor under Ottoman occupation...",
        content: "Karagiozis, the beloved shadow puppet character, emerged during Ottoman rule as more than just entertainment – he became a voice of Greek resistance. Created in the 19th century, Karagiozis represented the common Greek under Ottoman rule: poor, clever, and always trying to outsmart authority. The shadow puppet shows were performed in coffee houses and public squares, providing a safe way to criticize Ottoman rule through humor and satire. Karagiozis himself was depicted as a hunchbacked, poor Greek who lived in a shack but possessed incredible wit. His adventures often involved outwitting Turkish officials, rich merchants, or other authority figures. The puppet shows used colloquial Greek, helping preserve the language during a time when official Ottoman Turkish was dominant. Most importantly, these performances maintained Greek cultural identity and provided hope through laughter during difficult times. The character became so popular that 'Karagiozis' became synonymous with a clever trickster in Greek culture, and the tradition continues today.",
        readTime: 3
      },
      {
        id: 8,
        title: "The Oracle's Last Prophecy",
        era: "Ancient",
        preview: "When Emperor Julian tried to revive the Oracle of Delphi, he received a prophecy that marked the end of an era...",
        content: "In 362 CE, Emperor Julian the Apostate, attempting to restore paganism in the Roman Empire, sent his physician Oribasius to consult the Oracle of Delphi, which had been silent for decades under Christian rule. The oracle's response was haunting and final: 'Tell the king that the fair-wrought house has fallen to the ground. No longer has Phoebus a hut, nor a prophetic laurel, nor a spring that speaks. The water of speech even is quenched.' This was the last recorded prophecy from Delphi, marking the end of over 1,000 years of oracular tradition. The oracle essentially announced its own death and the end of the ancient world. Julian died shortly after in battle, and Christianity continued its dominance. The sacred site, once the center of the ancient Greek world where kings and commoners sought divine guidance, fell into ruins. This final prophecy symbolically marked the transition from the ancient pagan world to the Christian Byzantine era, making it one of the most poignant moments in Greek history.",
        readTime: 3
      },
      {
        id: 9,
        title: "The Philosopher's Cloak: Socrates' Simple Life",
        era: "Ancient",
        preview: "Why the greatest philosopher of Athens chose to wear the same simple cloak year-round...",
        content: "Socrates, the father of Western philosophy, was famous not just for his wisdom but for his deliberately simple lifestyle. He wore the same rough woolen cloak (himation) throughout the year, regardless of weather. This wasn't poverty but a philosophical choice. Socrates believed that material possessions distracted from the pursuit of knowledge and virtue. His single cloak became a symbol of his teachings about the unexamined life. When his wealthy friend Crito offered him fine clothes, Socrates refused, saying that true wealth came from wisdom, not material goods. His students, including Plato, often wrote about how their teacher's simple appearance contrasted with the profound depth of his thoughts. This practice influenced generations of philosophers who saw material simplicity as essential to intellectual freedom.",
        readTime: 2
      },
      {
        id: 10,
        title: "The Miracle of Modern Greek Coffee",
        era: "Modern",
        preview: "How Greek coffee became a UNESCO cultural heritage and a daily ritual that brings people together...",
        content: "Greek coffee, known as 'ellinikos kafes,' is far more than a beverage—it's a UNESCO-recognized cultural heritage that embodies the Greek way of life. The preparation ritual is almost ceremonial: finely ground coffee is slowly boiled in a special pot called a 'briki' with sugar and water. The foam (kaimaki) that forms on top is considered the hallmark of perfectly prepared coffee. What makes Greek coffee special isn't just the preparation, but the social aspect. Greeks don't drink coffee to rush off to work; they sit, talk, and enjoy the moment. The coffee grounds that settle at the bottom are used for fortune telling (tasseography), turning the end of the drink into entertainment. This tradition dates back to Ottoman times but has become distinctly Greek, representing hospitality, friendship, and the art of taking time in our fast-paced world.",
        readTime: 3
      },
      {
        id: 11,
        title: "The Secret Code of Mount Athos",
        era: "Byzantine",
        preview: "The autonomous monastic state that has banned women for over 1,000 years and maintains its own time system...",
        content: "Mount Athos, also known as the 'Holy Mountain,' is a unique autonomous monastic state in northern Greece that has operated under its own laws for over 1,000 years. What makes it truly extraordinary is its complete ban on women—not just human females, but all female animals except cats (for rodent control) and laying hens. This 'avaton' (prohibition) has been maintained since 1045 CE. The peninsula houses 20 Eastern Orthodox monasteries and follows the old Julian calendar, making it 13 days behind the rest of the world. Even more unusual, some monasteries follow 'Byzantine time,' where the day begins at sunset. Only adult males with special permits can visit, and only 100 non-Orthodox visitors are allowed daily. The monks preserve ancient manuscripts, practice traditional crafts, and maintain a way of life virtually unchanged since the Middle Ages, making it a living museum of Byzantine culture.",
        readTime: 3
      },
      {
        id: 12,
        title: "The Rebetiko Underground",
        era: "Modern",
        preview: "How the 'Greek blues' emerged from hashish dens and became the soul of a nation...",
        content: "Rebetiko, often called the 'Greek blues,' emerged in the early 20th century from the underground hashish dens (tekedes) of Athens and Piraeus. Born from the pain of refugees who fled Asia Minor after 1922, this music expressed the struggles of society's outcasts: criminals, drug users, and the urban poor. The government initially banned rebetiko, considering it immoral and subversive. Musicians were arrested, and their bouzoukis confiscated. The lyrics spoke of forbidden love, prison, drugs, and defiance against authority—themes that resonated with those society had forgotten. Despite persecution, the music survived and evolved. By the 1950s, rebetiko had been sanitized and accepted into mainstream Greek culture. Composers like Markos Vamvakaris and Vasilis Tsitsanis became national heroes. Today, rebetiko is recognized as an authentic Greek art form that captures the resilience of the human spirit in the face of adversity.",
        readTime: 3
      },
      {
        id: 13,
        title: "The Mystery of Linear B",
        era: "Ancient",
        preview: "The ancient script that remained unbroken for 3,000 years until a young British architect changed everything...",
        content: "Linear B was one of archaeology's greatest puzzles—an ancient script found on clay tablets across Bronze Age Greece that no one could read for over 50 years after its discovery. The tablets, dating from 1450-1200 BCE, were found at Pylos, Mycenae, and Knossos, but their meaning remained a complete mystery. Then in 1952, a young British architect named Michael Ventris achieved what scholars thought impossible: he deciphered Linear B and proved it was an early form of Greek, pushing back the date of written Greek by 700 years. The tablets revealed not poetry or philosophy, but mundane palace records: inventories of sheep, lists of workers, and tax records. However, these 'boring' documents revolutionized our understanding of Mycenaean civilization, proving that the Greeks had a sophisticated bureaucratic system centuries before Homer. The decipherment also revealed that many Greek religious practices and deity names existed in Bronze Age times, showing remarkable continuity in Greek culture.",
        readTime: 3
      },
      {
        id: 14,
        title: "The Dancing Plague of Monemvasia",
        era: "Byzantine",
        preview: "When an entire medieval town couldn't stop dancing, and how spider bites might have caused mass hysteria...",
        content: "In the medieval fortress town of Monemvasia, a strange phenomenon occurred that baffled physicians and clergy alike: the 'dancing plague.' Citizens would suddenly begin dancing uncontrollably, unable to stop for hours or even days. The condition was called 'tarantism,' and locals believed it was caused by the bite of a local spider. The only cure, they thought, was more dancing—specifically to music played in a particular rhythm called 'tarantella.' Modern researchers believe this may have been a form of mass psychogenic illness, possibly triggered by ergot poisoning from contaminated grain, or indeed by spider venom causing neurological symptoms. What's fascinating is how the community developed a musical therapy for the condition. Musicians would play specific melodies believed to 'sweat out' the poison. This tradition influenced folk music across the Mediterranean. While the dancing plague eventually disappeared, the musical traditions it spawned continued, and similar phenomena have been recorded throughout European history.",
        readTime: 3
      },
      {
        id: 15,
        title: "The Language of the Sarakatsani",
        era: "Obscure",
        preview: "The nomadic shepherds who preserved ancient Greek words while wandering the mountains for centuries...",
        content: "The Sarakatsani were nomadic shepherds who roamed the mountains of Greece for over 500 years, living in temporary huts and following ancient migration routes with their flocks. What makes them extraordinary is their language—a dialect that preserved ancient Greek words and expressions that had disappeared everywhere else. Isolated by their nomadic lifestyle, the Sarakatsani maintained linguistic features from classical and Byzantine Greek that scholars thought were extinct. They had no written tradition, passing down everything orally: epic songs, stories, and an incredibly complex kinship system. Their society was entirely egalitarian, with decisions made by councils of elders. They practiced a form of Christianity mixed with pre-Christian beliefs, including rituals to protect their flocks from wolves and diseases. The Sarakatsani began settling in permanent villages only in the 1960s, ending centuries of nomadism. Today, their traditional way of life has almost disappeared, but their dialect provides invaluable insights into how ancient Greek may have sounded and evolved.",
        readTime: 3
      }
    ])
    
    const filteredStories = computed(() => {
      let filtered = stories.value
      
      // Filter by era
      if (activeFilter.value === 'Daily') {
        filtered = dailyStories.value
      } else if (activeFilter.value !== 'All') {
        filtered = filtered.filter(story => story.era === activeFilter.value)
      }
      
      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(story => 
          story.title.toLowerCase().includes(query) ||
          story.preview.toLowerCase().includes(query) ||
          story.content.toLowerCase().includes(query) ||
          story.era.toLowerCase().includes(query)
        )
      }
      
      return filtered
    })
    
    const sortedStories = computed(() => {
      const sorted = [...filteredStories.value]
      
      switch (sortBy.value) {
        case 'title':
          return sorted.sort((a, b) => a.title.localeCompare(b.title))
        case 'era':
          return sorted.sort((a, b) => a.era.localeCompare(b.era))
        case 'readTime':
          return sorted.sort((a, b) => a.readTime - b.readTime)
        case 'newest':
          return sorted.reverse()
        default:
          return sorted
      }
    })
    
    const totalFilteredStories = computed(() => sortedStories.value.length)
    
    const totalPages = computed(() => {
      if (viewMode.value === 'infinite') return 1
      return Math.ceil(totalFilteredStories.value / storiesPerPage.value)
    })
    
    const displayedStories = computed(() => {
      if (viewMode.value === 'infinite') {
        return sortedStories.value.slice(0, currentPage.value * storiesPerPage.value)
      } else {
        const start = (currentPage.value - 1) * storiesPerPage.value
        const end = start + storiesPerPage.value
        return sortedStories.value.slice(start, end)
      }
    })
    
    const hasMoreStories = computed(() => {
      return viewMode.value === 'infinite' && 
             displayedStories.value.length < totalFilteredStories.value
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        
        if (current > 4) {
          pages.push('...')
        }
        
        const start = Math.max(2, current - 2)
        const end = Math.min(total - 1, current + 2)
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
        
        if (current < total - 3) {
          pages.push('...')
        }
        
        pages.push(total)
      }
      
      return pages
    })
    
    const toggleStory = (storyId, scrollToStory = false) => {
      const index = expandedStories.value.indexOf(storyId)
      if (index > -1) {
        expandedStories.value.splice(index, 1)
      } else {
        expandedStories.value.push(storyId)
        
        // If scrollToStory is true, scroll to the story in the main section
        if (scrollToStory) {
          // Use nextTick to ensure the DOM is updated before scrolling
          setTimeout(() => {
            const storyElement = document.querySelector(`[data-story-id="${storyId}"]`)
            if (storyElement) {
              storyElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
              })
              
              // Add a highlight effect
              storyElement.classList.add('highlight-story')
              setTimeout(() => {
                storyElement.classList.remove('highlight-story')
              }, 2000)
            }
          }, 100)
        }
      }
    }
    
    const getCurrentDateFormatted = () => {
      const today = new Date()
      return today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
    
    const getDailyStories = () => {
      // Use current date to create a consistent daily rotation
      const today = new Date()
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
      
      // Create a seed based on the day to ensure same stories throughout the day
      const seed = dayOfYear % stories.value.length
      
      // Select 2 stories for today using the seed
      const selectedStories = []
      const storyCount = stories.value.length
      
      // First story
      selectedStories.push(stories.value[seed % storyCount])
      
      // Second story (ensure it's different from the first)
      const secondIndex = (seed + Math.floor(storyCount / 2)) % storyCount
      selectedStories.push(stories.value[secondIndex])
      
      return selectedStories
    }
    
    const isDailyStory = (storyId) => {
      return dailyStories.value.some(story => story.id === storyId)
    }
    
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        // Scroll to top of stories section
        const storiesSection = document.querySelector('.py-5')
        if (storiesSection) {
          storiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
    
    const loadMoreStories = () => {
      loadingMore.value = true
      
      // Simulate loading time for better UX
      setTimeout(() => {
        currentPage.value += 1
        loadingMore.value = false
      }, 800)
    }
    
    onMounted(() => {
      // Set daily stories
      dailyStories.value = getDailyStories()
      
      // Simulate loading
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
    
    return {
      loading,
      searchQuery,
      activeFilter,
      expandedStories,
      dailyStories,
      currentPage,
      storiesPerPage,
      sortBy,
      viewMode,
      loadingMore,
      eras,
      sortOptions,
      stories,
      filteredStories,
      sortedStories,
      totalFilteredStories,
      totalPages,
      displayedStories,
      hasMoreStories,
      visiblePages,
      toggleStory,
      getCurrentDateFormatted,
      isDailyStory,
      goToPage,
      loadMoreStories
    }
  }
}
</script>
