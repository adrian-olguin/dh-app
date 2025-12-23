import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        search: "Search",
        login: "Login",
        darkMode: "Toggle dark mode",
        language: "Change language"
      },
      search: {
        placeholder: "Find what you need",
        clear: "Clear",
        all: "All",
        devotionals: "Devos",
        audio: "Audio",
        videos: "Videos",
        showing: "Showing",
        result: "result",
        results: "results",
        loading: "Loading content from Read, Listen, and Watch…",
        noResults: "No results found. Try another keyword.",
        open: "Open",
        devotional: "devotional",
        audioType: "audio",
        video: "video"
      },
      tabs: {
        listen: "Listen",
        watch: "Watch",
        read: "Read",
        give: "Give"
      },
      listen: {
        title: "Daily Broadcast",
        pastor: "Pastor Rick Warren",
        recentEpisodes: "Recent Episodes",
        selectDate: "Select Date",
        shareMessage: "Share Message",
        downloadOffline: "Download for Offline",
        savedOffline: "Saved for Offline",
        loading: "Loading episodes...",
        noEpisodes: "No episodes available",
        retryLoading: "Retry Loading Episodes",
        nowPlaying: "Now Playing"
      },
      watch: {
        featured: "Featured",
        recentMessages: "Recent Messages",
        date: "Date",
        shareMessage: "Share Message",
        downloadOffline: "Download for Offline",
        savedOffline: "Saved for Offline",
        pastor: "Pastor Rick Warren",
        featuredTitle: "Finding Peace in Uncertainty",
        featuredDescription: "Pastor Rick shares powerful insights on finding hope and peace in challenging times.",
        videos: {
          powerOfFaith: "The Power of Faith",
          livingWithPurpose: "Living with Purpose",
          overcomingChallenges: "Overcoming Challenges",
          walkingInLove: "Walking in Love",
          godsGrace: "God's Grace and Mercy",
          buildingRelationships: "Building Strong Relationships"
        }
      },
      read: {
        devotional: "Devotional",
        date: "Date",
        readToday: "Read Today's Devotional",
        recentDevotionals: "Recent Devotionals",
        todaysDevotional: "Today's Devotional",
        todaysPrayer: "Today's Prayer",
        downloadOffline: "Download for Offline",
        savedOffline: "Saved for Offline",
        pastor: "Pastor Rick Warren",
        title: "Finding Peace in Uncertainty",
        verse: "\"Now faith is confidence in what we hope for and assurance about what we do not see.\" - Hebrews 11:1",
        content1: "Faith is not about having all the answers or seeing the complete picture. It's about trusting God even when the path ahead seems unclear. Today, I want to encourage you to take that step of faith, knowing that God is with you every moment.",
        content2: "Think about the times in your life when you've had to trust God without seeing the outcome. Perhaps you're in that place right now. Remember that faith grows stronger not in the comfort zone, but in the moments when we choose to trust God despite our circumstances.",
        content3: "God has never failed anyone who put their trust in Him. His track record is perfect. When you feel uncertain, look back at how God has been faithful in your life before. Let those memories strengthen your faith today.",
        prayer: "Dear God, help me to walk in faith today. Give me the courage to trust You even when I can't see the way forward. Strengthen my faith and help me remember Your faithfulness. In Jesus' name, Amen."
      },
      give: {
        thankYou: "Thank You for Your Generosity",
        helpMessage: "Your gift helps share the message of hope with people around the world.",
        livesTouched: "Lives Touched",
        countriesReached: "Countries Reached",
        dailyDevotionals: "Daily Devotionals",
        viewerGrowth: "Viewer Growth",
        supportTitle: "Support Daily Hope",
        chooseGive: "Choose how you'd like to give",
        giveOnce: "Give Today",
        partnerInHope: "Give Monthly",
        selectAmount: "Select Amount",
        customAmount: "Or Enter Custom Amount",
        continuePayment: "Continue to Payment",
        processing: "Processing...",
        monthlyBenefits: "Monthly Partner Benefits",
        monthlyAmount: "Monthly Amount",
        customMonthlyAmount: "Or Enter Custom Monthly Amount",
        becomePartner: "Give Monthly",
        livesChanged: "Lives Changed by Your Support",
        otherWays: "Other Ways to Give",
        mailGift: "Mail Your Gift",
        phone: "Phone",
        english: "English",
        spanish: "Spanish",
        nonprofit: "Daily Hope is a 501(c)(3) Non-Profit Ministry",
        taxDeductible: "All donations are tax-deductible",
        monthlyImpact: "Your monthly partnership sustains our mission to share hope worldwide.",
        oneTimeImpact: "Your donation is tax-deductible and helps us reach more people with the message of hope.",
        error: {
          invalidAmount: "Please enter a valid amount",
          processing: "Unable to process donation. Please try again."
        },
        success: {
          title: "Thank You!",
          subtitle: "Your generosity makes a difference",
          received: "Donation Received",
          message: "Thank you for your generous donation to Daily Hope Ministry. Your support helps us share the message of hope with people around the world.",
          email: "A receipt has been sent to your email address.",
          returnHome: "Return Home"
        },
        benefits: {
          lasting: "Make a lasting impact with consistent support",
          updates: "Receive exclusive monthly updates from Pastor Rick",
          resources: "Access to special resources and content",
          modify: "Cancel or modify your gift anytime"
        },
        history: {
          title: "Donation History",
          description: "View your past donations and download receipts",
          noDonations: "No Donations Yet",
          noDonationsDescription: "Your donation history will appear here once you make your first gift",
          loginRequired: "Login Required",
          loginDescription: "Please login to view your donation history",
          errorTitle: "Error Loading Donations",
          errorDescription: "Could not load your donation history. Please try again.",
          downloadReceipt: "Download Receipt",
          statusCompleted: "Completed",
          statusPending: "Pending",
          statusFailed: "Failed",
          statusRefunded: "Refunded",
          typeMonthly: "Monthly",
          typeOneTime: "One-Time",
          totalDonations: "{{count}} total donation(s)"
        },
        stories: {
          maria: {
            name: "Maria's Story",
            location: "Philippines",
            story: "Through your support, I discovered hope during my darkest moments. The daily devotionals helped me rebuild my faith and find purpose again."
          },
          john: {
            name: "John's Journey",
            location: "United States",
            story: "Your generosity made it possible for me to access these life-changing messages. They've transformed my relationship with God and my family."
          },
          sarah: {
            name: "Sarah's Testimony",
            location: "United Kingdom",
            story: "The Partner In Hope program brought God's word into my daily routine. I'm grateful for supporters like you who make this ministry possible."
          }
        }
      },
      common: {
        play: "Play",
        pause: "Pause",
        share: "Share",
        bookmark: "Bookmark",
        thanksSharing: "Thanks for sharing!",
        couldNotShare: "Could not share",
        copiedTikTok: "Copied! Now paste in TikTok",
        copiedTikTokDesc: "Content copied to clipboard - open TikTok and paste it in your post",
        copiedInstagram: "Copied! Now paste in Instagram",
        copiedInstagramDesc: "Content copied to clipboard - open Instagram and paste it in your post",
        couldNotCopy: "Could not copy to clipboard",
        respondTikTok: "Respond on TikTok",
        shareInstagram: "Share on Instagram",
        shareEmail: "Share via Email",
        textFriend: "Text A Friend",
        shareWhatsApp: "Share on WhatsApp",
        shareTwitter: "Share on Twitter",
        shareFacebook: "Share on Facebook"
      }
    }
  },
  es: {
    translation: {
      header: {
        search: "Buscar",
        login: "Iniciar sesión",
        darkMode: "Alternar modo oscuro",
        language: "Cambiar idioma"
      },
      search: {
        placeholder: "Encuentra lo que necesitas",
        clear: "Borrar",
        all: "Todos",
        devotionals: "Devos",
        audio: "Audio",
        videos: "Videos",
        showing: "Mostrando",
        result: "resultado",
        results: "resultados",
        loading: "Cargando contenido de Leer y Escuchar…",
        noResults: "No se encontraron resultados. Intenta otra palabra clave.",
        open: "Abrir",
        devotional: "devocional",
        audioType: "audio",
        video: "video"
      },
      tabs: {
        listen: "Escuchar",
        watch: "Ver",
        read: "Leer",
        give: "Dar"
      },
      listen: {
        title: "Transmisión Diaria",
        pastor: "Pastor Rick Warren",
        recentEpisodes: "Episodios Recientes",
        selectDate: "Seleccionar Fecha",
        shareMessage: "Compartir Mensaje",
        downloadOffline: "Descargar para Offline",
        savedOffline: "Guardado para Offline",
        loading: "Cargando episodios...",
        noEpisodes: "No hay episodios disponibles",
        retryLoading: "Reintentar Cargar Episodios",
        nowPlaying: "Reproduciendo Ahora"
      },
      watch: {
        featured: "Destacado",
        recentMessages: "Mensajes Recientes",
        date: "Fecha",
        shareMessage: "Compartir Mensaje",
        downloadOffline: "Descargar para Offline",
        savedOffline: "Guardado para Offline",
        pastor: "Pastor Rick Warren",
        featuredTitle: "Encontrando Paz en la Incertidumbre",
        featuredDescription: "El Pastor Rick comparte ideas poderosas sobre cómo encontrar esperanza y paz en tiempos difíciles.",
        videos: {
          powerOfFaith: "El Poder de la Fe",
          livingWithPurpose: "Vivir con Propósito",
          overcomingChallenges: "Superando Desafíos",
          walkingInLove: "Caminando en Amor",
          godsGrace: "La Gracia y Misericordia de Dios",
          buildingRelationships: "Construyendo Relaciones Fuertes"
        }
      },
      read: {
        devotional: "Devocional",
        date: "Fecha",
        readToday: "Leer el Devocional de Hoy",
        recentDevotionals: "Devocionales Recientes",
        todaysDevotional: "Devocional de Hoy",
        todaysPrayer: "Oración de Hoy",
        downloadOffline: "Descargar para Offline",
        savedOffline: "Guardado para Offline",
        pastor: "Pastor Rick Warren",
        title: "Encontrando Paz en la Incertidumbre",
        verse: "\"Ahora bien, la fe es la garantía de lo que se espera, la certeza de lo que no se ve.\" - Hebreos 11:1",
        content1: "La fe no se trata de tener todas las respuestas o ver el panorama completo. Se trata de confiar en Dios incluso cuando el camino por delante parece incierto. Hoy, quiero animarte a dar ese paso de fe, sabiendo que Dios está contigo en cada momento.",
        content2: "Piensa en los momentos de tu vida en los que has tenido que confiar en Dios sin ver el resultado. Quizás estés en ese lugar ahora mismo. Recuerda que la fe se fortalece no en la zona de confort, sino en los momentos en que elegimos confiar en Dios a pesar de nuestras circunstancias.",
        content3: "Dios nunca ha fallado a nadie que haya puesto su confianza en Él. Su historial es perfecto. Cuando te sientas incierto, mira hacia atrás y ve cómo Dios ha sido fiel en tu vida antes. Deja que esos recuerdos fortalezcan tu fe hoy.",
        prayer: "Querido Dios, ayúdame a caminar en fe hoy. Dame el coraje para confiar en Ti incluso cuando no pueda ver el camino por delante. Fortalece mi fe y ayúdame a recordar Tu fidelidad. En el nombre de Jesús, Amén."
      },
      give: {
        thankYou: "Gracias por Tu Generosidad",
        helpMessage: "Tu donación ayuda a compartir el mensaje de esperanza con personas de todo el mundo.",
        livesTouched: "Vidas Tocadas",
        countriesReached: "Países Alcanzados",
        dailyDevotionals: "Devocionales Diarios",
        viewerGrowth: "Crecimiento de Audiencia",
        supportTitle: "Apoyar Esperanza Diaria",
        chooseGive: "Elige cómo te gustaría dar",
        giveOnce: "Dar Hoy",
        partnerInHope: "Dar Mensualmente",
        selectAmount: "Seleccionar Cantidad",
        customAmount: "O Ingresa Cantidad Personalizada",
        continuePayment: "Continuar al Pago",
        processing: "Procesando...",
        monthlyBenefits: "Beneficios de Socio Mensual",
        monthlyAmount: "Cantidad Mensual",
        customMonthlyAmount: "O Ingresa Cantidad Mensual Personalizada",
        becomePartner: "Dar Mensualmente",
        livesChanged: "Vidas Transformadas por Tu Apoyo",
        otherWays: "Otras Formas de Dar",
        mailGift: "Envía Tu Donación por Correo",
        phone: "Teléfono",
        english: "Inglés",
        spanish: "Español",
        nonprofit: "Esperanza Diaria es un Ministerio Sin Fines de Lucro 501(c)(3)",
        taxDeductible: "Todas las donaciones son deducibles de impuestos",
        monthlyImpact: "Tu asociación mensual sostiene nuestra misión de compartir esperanza en todo el mundo.",
        oneTimeImpact: "Tu donación es deducible de impuestos y nos ayuda a llegar a más personas con el mensaje de esperanza.",
        error: {
          invalidAmount: "Por favor ingresa una cantidad válida",
          processing: "No se pudo procesar la donación. Por favor intenta de nuevo."
        },
        success: {
          title: "¡Gracias!",
          subtitle: "Tu generosidad marca la diferencia",
          received: "Donación Recibida",
          message: "Gracias por tu generosa donación al Ministerio Esperanza Diaria. Tu apoyo nos ayuda a compartir el mensaje de esperanza con personas de todo el mundo.",
          email: "Se ha enviado un recibo a tu dirección de correo electrónico.",
          returnHome: "Volver al Inicio"
        },
        benefits: {
          lasting: "Causa un impacto duradero con apoyo constante",
          updates: "Recibe actualizaciones mensuales exclusivas del Pastor Rick",
          resources: "Acceso a recursos y contenido especial",
          modify: "Cancela o modifica tu donación en cualquier momento"
        },
        history: {
          title: "Historial de Donaciones",
          description: "Ve tus donaciones pasadas y descarga recibos",
          noDonations: "Aún No Hay Donaciones",
          noDonationsDescription: "Tu historial de donaciones aparecerá aquí una vez que hagas tu primera donación",
          loginRequired: "Inicio de Sesión Requerido",
          loginDescription: "Por favor inicia sesión para ver tu historial de donaciones",
          errorTitle: "Error al Cargar Donaciones",
          errorDescription: "No se pudo cargar tu historial de donaciones. Por favor intenta de nuevo.",
          downloadReceipt: "Descargar Recibo",
          statusCompleted: "Completado",
          statusPending: "Pendiente",
          statusFailed: "Fallido",
          statusRefunded: "Reembolsado",
          typeMonthly: "Mensual",
          typeOneTime: "Una Vez",
          totalDonations: "{{count}} donación(es) total(es)"
        },
        stories: {
          maria: {
            name: "Historia de María",
            location: "Filipinas",
            story: "Gracias a su apoyo, descubrí esperanza durante mis momentos más oscuros. Los devocionales diarios me ayudaron a reconstruir mi fe y encontrar propósito nuevamente."
          },
          john: {
            name: "El Viaje de Juan",
            location: "Estados Unidos",
            story: "Su generosidad hizo posible que accediera a estos mensajes que cambiaron mi vida. Han transformado mi relación con Dios y mi familia."
          },
          sarah: {
            name: "Testimonio de Sara",
            location: "Reino Unido",
            story: "El programa Socio en Esperanza trajo la palabra de Dios a mi rutina diaria. Estoy agradecida por partidarios como usted que hacen posible este ministerio."
          }
        }
      },
      common: {
        play: "Reproducir",
        pause: "Pausar",
        share: "Compartir",
        bookmark: "Marcar",
        thanksSharing: "¡Gracias por compartir!",
        couldNotShare: "No se pudo compartir",
        copiedTikTok: "¡Copiado! Ahora pega en TikTok",
        copiedTikTokDesc: "Contenido copiado al portapapeles - abre TikTok y pégalo en tu publicación",
        copiedInstagram: "¡Copiado! Ahora pega en Instagram",
        copiedInstagramDesc: "Contenido copiado al portapapeles - abre Instagram y pégalo en tu publicación",
        couldNotCopy: "No se pudo copiar al portapapeles",
        respondTikTok: "Responder en TikTok",
        shareInstagram: "Compartir en Instagram",
        shareEmail: "Compartir por Correo",
        textFriend: "Enviar a un Amigo",
        shareWhatsApp: "Compartir en WhatsApp",
        shareTwitter: "Compartir en Twitter",
        shareFacebook: "Compartir en Facebook"
      }
    }
  },
  pt: {
    translation: {
      header: {
        search: "Pesquisar",
        login: "Entrar",
        darkMode: "Alternar modo escuro",
        language: "Mudar idioma"
      },
      tabs: {
        listen: "Ouvir",
        watch: "Assistir",
        read: "Ler",
        give: "Doar"
      },
      listen: {
        title: "Transmissão Diária",
        pastor: "Pastor Rick Warren",
        recentEpisodes: "Episódios Recentes",
        selectDate: "Selecionar Data",
        shareMessage: "Compartilhar Mensagem",
        downloadOffline: "Baixar para Offline",
        savedOffline: "Salvo para Offline",
        loading: "Carregando episódios...",
        noEpisodes: "Nenhum episódio disponível",
        retryLoading: "Tentar Carregar Episódios Novamente",
        nowPlaying: "Tocando Agora"
      },
      watch: {
        featured: "Destaque",
        recentMessages: "Mensagens Recentes",
        date: "Data",
        shareMessage: "Compartilhar Mensagem",
        downloadOffline: "Baixar para Offline",
        savedOffline: "Salvo para Offline",
        pastor: "Pastor Rick Warren",
        featuredTitle: "Encontrando Paz na Incerteza",
        featuredDescription: "O Pastor Rick compartilha insights poderosos sobre como encontrar esperança e paz em tempos difíceis.",
        videos: {
          powerOfFaith: "O Poder da Fé",
          livingWithPurpose: "Viver com Propósito",
          overcomingChallenges: "Superando Desafios",
          walkingInLove: "Caminhando no Amor",
          godsGrace: "Graça e Misericórdia de Deus",
          buildingRelationships: "Construindo Relacionamentos Fortes"
        }
      },
      read: {
        devotional: "Devocional",
        date: "Data",
        todaysPrayer: "Oração de Hoje",
        downloadOffline: "Baixar para Offline",
        savedOffline: "Salvo para Offline",
        pastor: "Pastor Rick Warren",
        title: "Encontrando Paz na Incerteza",
        verse: "\"Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.\" - Hebreus 11:1",
        content1: "A fé não se trata de ter todas as respostas ou ver o quadro completo. Trata-se de confiar em Deus mesmo quando o caminho à frente parece incerto. Hoje, quero encorajá-lo a dar esse passo de fé, sabendo que Deus está com você a cada momento.",
        content2: "Pense nos momentos da sua vida em que teve que confiar em Deus sem ver o resultado. Talvez você esteja nesse lugar agora. Lembre-se de que a fé cresce mais forte não na zona de conforto, mas nos momentos em que escolhemos confiar em Deus apesar das nossas circunstâncias.",
        content3: "Deus nunca falhou com ninguém que depositou nele a sua confiança. O Seu histórico é perfeito. Quando se sentir incerto, olhe para trás e veja como Deus foi fiel na sua vida antes. Deixe essas memórias fortalecerem a sua fé hoje.",
        prayer: "Querido Deus, ajuda-me a caminhar na fé hoje. Dá-me coragem para confiar em Ti mesmo quando não consigo ver o caminho à frente. Fortalece a minha fé e ajuda-me a lembrar da Tua fidelidade. Em nome de Jesus, Amém."
      },
      give: {
        thankYou: "Obrigado pela Sua Generosidade",
        helpMessage: "A sua doação ajuda a partilhar a mensagem de esperança com pessoas de todo o mundo.",
        livesTouched: "Vidas Tocadas",
        countriesReached: "Países Alcançados",
        dailyDevotionals: "Devocionais Diários",
        viewerGrowth: "Crescimento de Audiência",
        supportTitle: "Apoiar Esperança Diária",
        chooseGive: "Escolha como gostaria de doar",
        giveOnce: "Doar Hoje",
        partnerInHope: "Doar Mensalmente",
        selectAmount: "Selecionar Valor",
        customAmount: "Ou Insira Valor Personalizado",
        continuePayment: "Continuar para Pagamento",
        monthlyBenefits: "Benefícios de Parceiro Mensal",
        monthlyAmount: "Valor Mensal",
        customMonthlyAmount: "Ou Insira Valor Mensal Personalizado",
        becomePartner: "Doar Mensalmente",
        livesChanged: "Vidas Transformadas pelo Seu Apoio",
        otherWays: "Outras Formas de Doar",
        mailGift: "Envie Sua Doação pelo Correio",
        phone: "Telefone",
        english: "Inglês",
        spanish: "Espanhol",
        nonprofit: "Esperança Diária é um Ministério Sem Fins Lucrativos 501(c)(3)",
        taxDeductible: "Todas as doações são dedutíveis de impostos",
        monthlyImpact: "A sua parceria mensal sustenta a nossa missão de partilhar esperança em todo o mundo.",
        oneTimeImpact: "A sua doação é dedutível de impostos e ajuda-nos a alcançar mais pessoas com a mensagem de esperança.",
        benefits: {
          lasting: "Cause um impacto duradouro com apoio consistente",
          updates: "Receba atualizações mensais exclusivas do Pastor Rick",
          resources: "Acesso a recursos e conteúdo especial",
          modify: "Cancele ou modifique a sua doação a qualquer momento"
        },
        history: {
          title: "Histórico de Doações",
          description: "Veja suas doações passadas e baixe recibos",
          noDonations: "Ainda Não Há Doações",
          noDonationsDescription: "Seu histórico de doações aparecerá aqui assim que você fizer sua primeira doação",
          loginRequired: "Login Necessário",
          loginDescription: "Por favor faça login para ver seu histórico de doações",
          errorTitle: "Erro ao Carregar Doações",
          errorDescription: "Não foi possível carregar seu histórico de doações. Por favor tente novamente.",
          downloadReceipt: "Baixar Recibo",
          statusCompleted: "Concluído",
          statusPending: "Pendente",
          statusFailed: "Falhou",
          statusRefunded: "Reembolsado",
          typeMonthly: "Mensal",
          typeOneTime: "Uma Vez",
          totalDonations: "{{count}} doação(ões) no total"
        },
        stories: {
          maria: {
            name: "História de Maria",
            location: "Filipinas",
            story: "Através do seu apoio, descobri esperança durante os meus momentos mais sombrios. Os devocionais diários ajudaram-me a reconstruir a minha fé e encontrar propósito novamente."
          },
          john: {
            name: "Jornada de João",
            location: "Estados Unidos",
            story: "A sua generosidade tornou possível o meu acesso a estas mensagens que mudaram a minha vida. Elas transformaram o meu relacionamento com Deus e a minha família."
          },
          sarah: {
            name: "Testemunho de Sara",
            location: "Reino Unido",
            story: "O programa Parceiro em Esperança trouxe a palavra de Deus para a minha rotina diária. Estou grata por apoiantes como você que tornam este ministério possível."
          }
        }
      },
      common: {
        play: "Reproduzir",
        pause: "Pausar",
        share: "Compartilhar",
        bookmark: "Marcar",
        thanksSharing: "Obrigado por compartilhar!",
        couldNotShare: "Não foi possível compartilhar",
        copiedTikTok: "Copiado! Agora cole no TikTok",
        copiedTikTokDesc: "Conteúdo copiado para a área de transferência - abra o TikTok e cole na sua publicação",
        copiedInstagram: "Copiado! Agora cole no Instagram",
        copiedInstagramDesc: "Conteúdo copiado para a área de transferência - abra o Instagram e cole na sua publicação",
        couldNotCopy: "Não foi possível copiar para a área de transferência",
        respondTikTok: "Responder no TikTok",
        shareInstagram: "Compartilhar no Instagram",
        shareEmail: "Compartilhar por Email",
        textFriend: "Enviar para um Amigo",
        shareWhatsApp: "Compartilhar no WhatsApp",
        shareTwitter: "Compartilhar no Twitter",
        shareFacebook: "Compartilhar no Facebook"
      }
    }
  },
  fr: {
    translation: {
      header: {
        search: "Rechercher",
        login: "Connexion",
        darkMode: "Basculer le mode sombre",
        language: "Changer de langue"
      },
      tabs: {
        listen: "Écouter",
        watch: "Regarder",
        read: "Lire",
        give: "Donner"
      },
      listen: {
        title: "Diffusion Quotidienne",
        pastor: "Pasteur Rick Warren",
        recentEpisodes: "Épisodes Récents",
        selectDate: "Sélectionner la Date",
        shareMessage: "Partager le Message",
        downloadOffline: "Télécharger pour Hors Ligne",
        savedOffline: "Enregistré pour Hors Ligne",
        loading: "Chargement des épisodes...",
        noEpisodes: "Aucun épisode disponible",
        retryLoading: "Réessayer de Charger les Épisodes",
        nowPlaying: "En Cours de Lecture"
      },
      watch: {
        featured: "À la Une",
        recentMessages: "Messages Récents",
        date: "Date",
        shareMessage: "Partager le Message",
        downloadOffline: "Télécharger pour Hors Ligne",
        savedOffline: "Enregistré pour Hors Ligne",
        pastor: "Pasteur Rick Warren",
        featuredTitle: "Trouver la Paix dans l'Incertitude",
        featuredDescription: "Le Pasteur Rick partage des réflexions puissantes sur la façon de trouver l'espoir et la paix dans les moments difficiles.",
        videos: {
          powerOfFaith: "Le Pouvoir de la Foi",
          livingWithPurpose: "Vivre avec un But",
          overcomingChallenges: "Surmonter les Défis",
          walkingInLove: "Marcher dans l'Amour",
          godsGrace: "La Grâce et la Miséricorde de Dieu",
          buildingRelationships: "Construire des Relations Solides"
        }
      },
      read: {
        devotional: "Dévotion",
        date: "Date",
        todaysPrayer: "Prière d'Aujourd'hui",
        downloadOffline: "Télécharger pour Hors Ligne",
        savedOffline: "Enregistré pour Hors Ligne",
        pastor: "Pasteur Rick Warren",
        title: "Trouver la Paix dans l'Incertitude",
        verse: "\"Or la foi est l'assurance des choses qu'on espère, la démonstration de celles qu'on ne voit pas.\" - Hébreux 11:1",
        content1: "La foi ne consiste pas à avoir toutes les réponses ou à voir l'image complète. Il s'agit de faire confiance à Dieu même lorsque le chemin à parcourir semble incertain. Aujourd'hui, je veux vous encourager à faire ce pas de foi, sachant que Dieu est avec vous à chaque instant.",
        content2: "Pensez aux moments de votre vie où vous avez dû faire confiance à Dieu sans voir le résultat. Peut-être êtes-vous dans cette situation en ce moment. Rappelez-vous que la foi se renforce non pas dans la zone de confort, mais dans les moments où nous choisissons de faire confiance à Dieu malgré nos circonstances.",
        content3: "Dieu n'a jamais failli à quiconque a placé sa confiance en Lui. Son bilan est parfait. Lorsque vous vous sentez incertain, regardez en arrière et voyez comment Dieu a été fidèle dans votre vie auparavant. Laissez ces souvenirs renforcer votre foi aujourd'hui.",
        prayer: "Cher Dieu, aide-moi à marcher dans la foi aujourd'hui. Donne-moi le courage de Te faire confiance même quand je ne peux pas voir le chemin à parcourir. Renforce ma foi et aide-moi à me souvenir de Ta fidélité. Au nom de Jésus, Amen."
      },
      give: {
        thankYou: "Merci pour Votre Générosité",
        helpMessage: "Votre don aide à partager le message d'espoir avec des personnes du monde entier.",
        livesTouched: "Vies Touchées",
        countriesReached: "Pays Atteints",
        dailyDevotionals: "Dévotions Quotidiennes",
        viewerGrowth: "Croissance de l'Audience",
        supportTitle: "Soutenir Espoir Quotidien",
        chooseGive: "Choisissez comment vous souhaitez donner",
        giveOnce: "Donner Aujourd'hui",
        partnerInHope: "Donner Mensuellement",
        selectAmount: "Sélectionner le Montant",
        customAmount: "Ou Entrez un Montant Personnalisé",
        continuePayment: "Continuer vers le Paiement",
        monthlyBenefits: "Avantages du Partenaire Mensuel",
        monthlyAmount: "Montant Mensuel",
        customMonthlyAmount: "Ou Entrez un Montant Mensuel Personnalisé",
        becomePartner: "Donner Mensuellement",
        livesChanged: "Vies Transformées par Votre Soutien",
        otherWays: "Autres Façons de Donner",
        mailGift: "Envoyez Votre Don par Courrier",
        phone: "Téléphone",
        english: "Anglais",
        spanish: "Espagnol",
        nonprofit: "Espoir Quotidien est un Ministère à But Non Lucratif 501(c)(3)",
        taxDeductible: "Tous les dons sont déductibles d'impôts",
        monthlyImpact: "Votre partenariat mensuel soutient notre mission de partager l'espoir dans le monde entier.",
        oneTimeImpact: "Votre don est déductible d'impôts et nous aide à atteindre plus de personnes avec le message d'espoir.",
        benefits: {
          lasting: "Avoir un impact durable avec un soutien constant",
          updates: "Recevoir des mises à jour mensuelles exclusives du Pasteur Rick",
          resources: "Accès à des ressources et contenus spéciaux",
          modify: "Annuler ou modifier votre don à tout moment"
        },
        history: {
          title: "Historique des Dons",
          description: "Consultez vos dons passés et téléchargez vos reçus",
          noDonations: "Pas Encore de Dons",
          noDonationsDescription: "Votre historique de dons apparaîtra ici une fois que vous aurez fait votre premier don",
          loginRequired: "Connexion Requise",
          loginDescription: "Veuillez vous connecter pour voir votre historique de dons",
          errorTitle: "Erreur de Chargement des Dons",
          errorDescription: "Impossible de charger votre historique de dons. Veuillez réessayer.",
          downloadReceipt: "Télécharger le Reçu",
          statusCompleted: "Terminé",
          statusPending: "En Attente",
          statusFailed: "Échoué",
          statusRefunded: "Remboursé",
          typeMonthly: "Mensuel",
          typeOneTime: "Unique",
          totalDonations: "{{count}} don(s) au total"
        },
        stories: {
          maria: {
            name: "Histoire de Maria",
            location: "Philippines",
            story: "Grâce à votre soutien, j'ai découvert l'espoir pendant mes moments les plus sombres. Les dévotions quotidiennes m'ont aidée à reconstruire ma foi et à retrouver un but."
          },
          john: {
            name: "Le Parcours de Jean",
            location: "États-Unis",
            story: "Votre générosité m'a permis d'accéder à ces messages qui ont changé ma vie. Ils ont transformé ma relation avec Dieu et ma famille."
          },
          sarah: {
            name: "Témoignage de Sarah",
            location: "Royaume-Uni",
            story: "Le programme Partenaire dans l'Espoir a apporté la parole de Dieu dans ma routine quotidienne. Je suis reconnaissante envers les supporters comme vous qui rendent ce ministère possible."
          }
        }
      },
      common: {
        play: "Lire",
        pause: "Pause",
        share: "Partager",
        bookmark: "Marquer",
        thanksSharing: "Merci de partager !",
        couldNotShare: "Impossible de partager",
        copiedTikTok: "Copié ! Collez maintenant dans TikTok",
        copiedTikTokDesc: "Contenu copié dans le presse-papiers - ouvrez TikTok et collez-le dans votre publication",
        copiedInstagram: "Copié ! Collez maintenant dans Instagram",
        copiedInstagramDesc: "Contenu copié dans le presse-papiers - ouvrez Instagram et collez-le dans votre publication",
        couldNotCopy: "Impossible de copier dans le presse-papiers",
        respondTikTok: "Répondre sur TikTok",
        shareInstagram: "Partager sur Instagram",
        shareEmail: "Partager par Email",
        textFriend: "Envoyer à un Ami",
        shareWhatsApp: "Partager sur WhatsApp",
        shareTwitter: "Partager sur Twitter",
        shareFacebook: "Partager sur Facebook"
      }
    }
  },
  de: {
    translation: {
      header: {
        search: "Suche",
        login: "Anmelden",
        darkMode: "Dunkelmodus umschalten",
        language: "Sprache ändern"
      },
      tabs: {
        listen: "Hören",
        watch: "Ansehen",
        read: "Lesen",
        give: "Geben"
      },
      listen: {
        title: "Tägliche Sendung",
        pastor: "Pastor Rick Warren",
        recentEpisodes: "Neueste Episoden",
        selectDate: "Datum Auswählen",
        shareMessage: "Nachricht Teilen",
        downloadOffline: "Für Offline Herunterladen",
        savedOffline: "Für Offline Gespeichert",
        loading: "Episoden werden geladen...",
        noEpisodes: "Keine Episoden verfügbar",
        retryLoading: "Episoden Erneut Laden",
        nowPlaying: "Jetzt Läuft"
      },
      watch: {
        featured: "Empfohlen",
        recentMessages: "Neueste Botschaften",
        date: "Datum",
        shareMessage: "Nachricht Teilen",
        downloadOffline: "Für Offline Herunterladen",
        savedOffline: "Für Offline Gespeichert",
        pastor: "Pastor Rick Warren",
        featuredTitle: "Frieden Finden in Unsicherheit",
        featuredDescription: "Pastor Rick teilt kraftvolle Einsichten darüber, wie man Hoffnung und Frieden in schwierigen Zeiten findet.",
        videos: {
          powerOfFaith: "Die Kraft des Glaubens",
          livingWithPurpose: "Leben mit Sinn",
          overcomingChallenges: "Herausforderungen Überwinden",
          walkingInLove: "In Liebe Wandeln",
          godsGrace: "Gottes Gnade und Barmherzigkeit",
          buildingRelationships: "Starke Beziehungen Aufbauen"
        }
      },
      read: {
        devotional: "Andacht",
        date: "Datum",
        readToday: "Heutige Andacht Lesen",
        recentDevotionals: "Neueste Andachten",
        todaysPrayer: "Gebet des Tages",
        downloadOffline: "Für Offline Herunterladen",
        savedOffline: "Für Offline Gespeichert",
        pastor: "Pastor Rick Warren",
        title: "Frieden Finden in Unsicherheit",
        verse: "\"Es ist aber der Glaube eine feste Zuversicht dessen, was man hofft, und ein Nichtzweifeln an dem, was man nicht sieht.\" - Hebräer 11:1",
        content1: "Glaube bedeutet nicht, alle Antworten zu haben oder das vollständige Bild zu sehen. Es geht darum, Gott zu vertrauen, auch wenn der Weg vor uns unklar erscheint. Heute möchte ich Sie ermutigen, diesen Glaubensschritt zu gehen, im Wissen, dass Gott jeden Moment bei Ihnen ist.",
        content2: "Denken Sie an die Zeiten in Ihrem Leben, in denen Sie Gott vertrauen mussten, ohne das Ergebnis zu sehen. Vielleicht befinden Sie sich gerade in einer solchen Situation. Erinnern Sie sich daran, dass der Glaube nicht in der Komfortzone stärker wird, sondern in den Momenten, in denen wir uns entscheiden, Gott trotz unserer Umstände zu vertrauen.",
        content3: "Gott hat noch nie jemanden enttäuscht, der sein Vertrauen in Ihn gesetzt hat. Seine Erfolgsbilanz ist perfekt. Wenn Sie sich unsicher fühlen, schauen Sie zurück und sehen Sie, wie Gott in Ihrem Leben zuvor treu war. Lassen Sie diese Erinnerungen Ihren Glauben heute stärken.",
        prayer: "Lieber Gott, hilf mir, heute im Glauben zu wandeln. Gib mir den Mut, Dir zu vertrauen, auch wenn ich den Weg vor mir nicht sehen kann. Stärke meinen Glauben und hilf mir, mich an Deine Treue zu erinnern. Im Namen Jesu, Amen."
      },
      give: {
        thankYou: "Danke für Ihre Großzügigkeit",
        helpMessage: "Ihre Spende hilft dabei, die Botschaft der Hoffnung mit Menschen auf der ganzen Welt zu teilen.",
        livesTouched: "Berührte Leben",
        countriesReached: "Erreichte Länder",
        dailyDevotionals: "Tägliche Andachten",
        viewerGrowth: "Zuschauerwachstum",
        supportTitle: "Tägliche Hoffnung Unterstützen",
        chooseGive: "Wählen Sie, wie Sie geben möchten",
        giveOnce: "Heute Geben",
        partnerInHope: "Monatlich Geben",
        selectAmount: "Betrag Auswählen",
        customAmount: "Oder Eigenen Betrag Eingeben",
        continuePayment: "Weiter zur Zahlung",
        processing: "Wird verarbeitet...",
        monthlyBenefits: "Vorteile für Monatliche Partner",
        monthlyAmount: "Monatlicher Betrag",
        customMonthlyAmount: "Oder Eigenen Monatlichen Betrag Eingeben",
        becomePartner: "Monatlich Geben",
        livesChanged: "Durch Ihre Unterstützung Veränderte Leben",
        otherWays: "Andere Wege zu Geben",
        mailGift: "Spende per Post Senden",
        phone: "Telefon",
        english: "Englisch",
        spanish: "Spanisch",
        nonprofit: "Tägliche Hoffnung ist ein gemeinnütziger 501(c)(3) Dienst",
        taxDeductible: "Alle Spenden sind steuerlich absetzbar",
        monthlyImpact: "Ihre monatliche Partnerschaft unterstützt unsere Mission, Hoffnung weltweit zu teilen.",
        oneTimeImpact: "Ihre Spende ist steuerlich absetzbar und hilft uns, mehr Menschen mit der Botschaft der Hoffnung zu erreichen.",
        error: {
          invalidAmount: "Bitte geben Sie einen gültigen Betrag ein",
          processing: "Spende konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut."
        },
        success: {
          title: "Danke!",
          subtitle: "Ihre Großzügigkeit macht einen Unterschied",
          received: "Spende Erhalten",
          message: "Vielen Dank für Ihre großzügige Spende an den Dienst Tägliche Hoffnung. Ihre Unterstützung hilft uns, die Botschaft der Hoffnung mit Menschen auf der ganzen Welt zu teilen.",
          email: "Eine Quittung wurde an Ihre E-Mail-Adresse gesendet.",
          returnHome: "Zurück zur Startseite"
        },
        benefits: {
          lasting: "Einen dauerhaften Einfluss mit konstanter Unterstützung erzielen",
          updates: "Exklusive monatliche Updates von Pastor Rick erhalten",
          resources: "Zugang zu besonderen Ressourcen und Inhalten",
          modify: "Ihre Spende jederzeit stornieren oder ändern"
        },
        history: {
          title: "Spendenhistorie",
          description: "Sehen Sie Ihre vergangenen Spenden ein und laden Sie Quittungen herunter",
          noDonations: "Noch Keine Spenden",
          noDonationsDescription: "Ihre Spendenhistorie wird hier angezeigt, sobald Sie Ihre erste Spende getätigt haben",
          loginRequired: "Anmeldung Erforderlich",
          loginDescription: "Bitte melden Sie sich an, um Ihre Spendenhistorie einzusehen",
          errorTitle: "Fehler beim Laden der Spenden",
          errorDescription: "Ihre Spendenhistorie konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
          downloadReceipt: "Quittung Herunterladen",
          statusCompleted: "Abgeschlossen",
          statusPending: "Ausstehend",
          statusFailed: "Fehlgeschlagen",
          statusRefunded: "Erstattet",
          typeMonthly: "Monatlich",
          typeOneTime: "Einmalig",
          totalDonations: "{{count}} Spende(n) insgesamt"
        },
        stories: {
          maria: {
            name: "Marias Geschichte",
            location: "Philippinen",
            story: "Durch Ihre Unterstützung habe ich in meinen dunkelsten Momenten Hoffnung gefunden. Die täglichen Andachten haben mir geholfen, meinen Glauben wieder aufzubauen und einen neuen Sinn zu finden."
          },
          john: {
            name: "Johanns Reise",
            location: "Vereinigte Staaten",
            story: "Ihre Großzügigkeit hat es mir ermöglicht, auf diese lebensverändernden Botschaften zuzugreifen. Sie haben meine Beziehung zu Gott und meiner Familie verändert."
          },
          sarah: {
            name: "Sarahs Zeugnis",
            location: "Vereinigtes Königreich",
            story: "Das Partner-in-Hoffnung-Programm hat Gottes Wort in meinen Alltag gebracht. Ich bin dankbar für Unterstützer wie Sie, die diesen Dienst möglich machen."
          }
        }
      },
      common: {
        play: "Abspielen",
        pause: "Pause",
        share: "Teilen",
        bookmark: "Merken",
        thanksSharing: "Danke fürs Teilen!",
        couldNotShare: "Konnte nicht geteilt werden",
        copiedTikTok: "Kopiert! Jetzt in TikTok einfügen",
        copiedTikTokDesc: "Inhalt in die Zwischenablage kopiert - öffnen Sie TikTok und fügen Sie ihn in Ihren Beitrag ein",
        copiedInstagram: "Kopiert! Jetzt in Instagram einfügen",
        copiedInstagramDesc: "Inhalt in die Zwischenablage kopiert - öffnen Sie Instagram und fügen Sie ihn in Ihren Beitrag ein",
        couldNotCopy: "Konnte nicht in die Zwischenablage kopiert werden",
        respondTikTok: "Auf TikTok antworten",
        shareInstagram: "Auf Instagram teilen",
        shareEmail: "Per E-Mail teilen",
        textFriend: "Einem Freund schreiben",
        shareWhatsApp: "Auf WhatsApp teilen",
        shareTwitter: "Auf Twitter teilen",
        shareFacebook: "Auf Facebook teilen"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
