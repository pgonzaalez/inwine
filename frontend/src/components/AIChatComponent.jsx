import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Loader2 } from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    content: "Hola! Soc l'assistent virtual d'InWine. Com et puc ajudar avui?",
  },
];

export default function AIChatComponent() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactResult, setContactResult] = useState(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showContactForm, contactResult]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowContactForm(false); // Reset form if user types again

    // Simulate AI response
    setTimeout(() => {
      const responseObj = getSimulatedResponse(input);
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: responseObj.text,
        isFallback: responseObj.isFallback // Flag to show form
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      
      if (responseObj.isFallback) {
        setShowContactForm(true);
      }
    }, 1500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    
    // Simulate API call
    setTimeout(() => {
        setContactResult("Missatge enviat correctament! Et respondrem aviat per email.");
        setShowContactForm(false);
        setMessages(prev => [...prev, {
            id: Date.now(),
            role: "assistant", 
            content: `Gràcies ${name}. Hem rebut el teu missatge de contacte: "${message}". Et contactarem a ${email}.`
        }]);
    }, 1000);
  };

  const detectLanguage = (text) => {
    const lowerText = text.toLowerCase();
    // Simple heuristic for language detection
    if (/\b(hello|hi|good|morning|afternoon|help|please|thanks|thank|you|what|where|how|price|cost|buy|sell|wine|invest|register|login)\b/.test(lowerText)) return 'en';
    if (/\b(hola|buenos|dias|tardes|ayuda|por|favor|gracias|que|donde|como|precio|coste|comprar|vender|vino|invertir|registro|iniciar|sesion)\b/.test(lowerText)) return 'es';
    return 'ca'; // Default to Catalan
  };

  const getSimulatedResponse = (query) => {
    const lang = detectLanguage(query);
    const q = query.toLowerCase();
    
    // Multilingual Knowledge Base
    const knowledgeBase = [
      {
        keywords: {
          ca: ["hola", "bon dia", "bona tarda", "salutacions"],
          es: ["hola", "buenos dias", "buenas tardes", "saludos"],
          en: ["hello", "hi", "good morning", "greetings", "hey"]
        },
        responses: {
          ca: "Hola! 👋 Soc l'assistent virtual d'InWine. Com et puc ajudar avui? Tinc informació sobre registres, funcionalitats per a venedors, restaurants i inversors, i molt més.",
          es: "¡Hola! 👋 Soy el asistente virtual de InWine. ¿Cómo puedo ayudarte hoy? Tengo información sobre registros, funcionalidades para vendedores, restaurantes e inversores, y mucho más.",
          en: "Hello! 👋 I'm the InWine virtual assistant. How can I help you today? I have information about registration, features for sellers, restaurants, and investors, and much more."
        }
      },
      {
        keywords: {
          ca: ["registre", "registrar", "compte", "alta"],
          es: ["registro", "registrar", "cuenta", "alta", "crear"],
          en: ["register", "registration", "account", "sign up", "join"]
        },
        responses: {
          ca: "Pots registrar-te com a Venedor, Restaurant o Inversor. \n\n🍷 **Venedor**: Per a productors que volen vendre els seus vins.\n🍽️ **Restaurant**: Per a establiments que busquen vins exclusius.\n💼 **Inversor**: Per a qui vol invertir en el sector vinícola.\n\nQuin perfil t'interessa?",
          es: "Puedes registrarte como Vendedor, Restaurante o Inversor. \n\n🍷 **Vendedor**: Para productores que quieren vender sus vinos.\n🍽️ **Restaurante**: Para establecimientos que buscan vinos exclusivos.\n💼 **Inversor**: Para quien quiere invertir en el sector vinícola.\n\n¿Qué perfil te interesa?",
          en: "You can register as a Seller, Restaurant, or Investor. \n\n🍷 **Seller**: For producers looking to sell their wines.\n🍽️ **Restaurant**: For establishments seeking exclusive wines.\n💼 **Investor**: For those wishing to invest in the wine sector.\n\nWhich profile interests you?"
        }
      },
      {
        keywords: {
          ca: ["venedor", "seller", "productor", "vendre"],
          es: ["vendedor", "productor", "vender", "venta"],
          en: ["seller", "producer", "sell", "sales"]
        },
        responses: {
          ca: "Com a **Venedor**, pots: \n- Publicar els teus vins i gestionar l'estoc.\n- Veure estadístiques de vendes.\n- Gestionar el teu perfil i rebre notificacions.\n\nVols saber com registrar-te?",
          es: "Como **Vendedor**, puedes: \n- Publicar tus vinos y gestionar el stock.\n- Ver estadísticas de ventas.\n- Gestionar tu perfil y recibir notificaciones.\n\n¿Quieres saber cómo registrarte?",
          en: "As a **Seller**, you can: \n- Publish your wines and manage stock.\n- View sales statistics.\n- Manage your profile and receive notifications.\n\nDo you want to know how to register?"
        }
      },
      {
        keywords: {
          ca: ["restaurant", "restaurador"],
          es: ["restaurante", "restaurador", "hosteleria"],
          en: ["restaurant", "dining"]
        },
        responses: {
          ca: "Com a **Restaurant**, pots: \n- Accedir a un catàleg exclusiu de vins.\n- Fer comandes directament als productors.\n- Gestionar les teves sol·licituds i perfil.\n\nT'agradaria veure el catàleg?",
          es: "Como **Restaurante**, puedes: \n- Acceder a un catálogo exclusivo de vinos.\n- Hacer pedidos directamente a los productores.\n- Gestionar tus solicitudes y perfil.\n\n¿Te gustaría ver el catálogo?",
          en: "As a **Restaurant**, you can: \n- Access an exclusive wine catalog.\n- Order directly from producers.\n- Manage your requests and profile.\n\nWould you like to see the catalog?"
        }
      },
      {
        keywords: {
          ca: ["inversor", "investor", "invertir"],
          es: ["inversor", "inversionista", "invertir", "inversion"],
          en: ["investor", "invest", "investment"]
        },
        responses: {
          ca: "Com a **Inversor**, pots: \n- Veure oportunitats d'inversió en el sector.\n- Consultar el teu històric d'inversions.\n- Accedir a un dashboard personalitzat.\n\nVols començar a invertir?",
          es: "Como **Inversor**, puedes: \n- Ver oportunidades de inversión en el sector.\n- Consultar tu histórico de inversiones.\n- Acceder a un dashboard personalizado.\n\n¿Quieres empezar a invertir?",
          en: "As an **Investor**, you can: \n- View investment opportunities in the sector.\n- Check your investment history.\n- Access a personalized dashboard.\n\nDo you want to start investing?"
        }
      },
      {
        keywords: {
          ca: ["preu", "cost", "tarifes", "pagament"],
          es: ["precio", "costo", "coste", "tarifas", "pago"],
          en: ["price", "cost", "rates", "payment", "fee"]
        },
        responses: {
          ca: "El registre a InWine és gratuït. Els costos depenen de les transaccions o inversions que realitzis. Pots consultar els detalls específics durant el procés de 'Checkout' o a les condicions del servei.",
          es: "El registro en InWine es gratuito. Los costes dependen de las transacciones o inversiones que realices. Puedes consultar los detalles específicos durante el proceso de 'Checkout' o en las condiciones del servicio.",
          en: "Registration at InWine is free. Costs depend on the transactions or investments you make. You can check specific details during the 'Checkout' process or in the service terms."
        }
      },
      {
        keywords: {
          ca: ["login", "iniciar sessió", "entrar", "password", "contrasenya"],
          es: ["login", "iniciar sesion", "entrar", "password", "contraseña", "acceder"],
          en: ["login", "sign in", "enter", "password", "access"]
        },
        responses: {
          ca: "Pots iniciar sessió des de la pàgina principal fent clic a 'Login'. Si has oblidat la teva contrasenya, hi ha una opció per restablir-la a la mateixa pàgina d'accés.",
          es: "Puedes iniciar sesión desde la página principal haciendo clic en 'Login'. Si has olvidado tu contraseña, hay una opción para restablecerla en la misma página de acceso.",
          en: "You can log in from the main page by clicking 'Login'. If you forgot your password, there is an option to reset it on the same access page."
        }
      },
      {
        keywords: {
          ca: ["producte", "vi", "vins", "catàleg", "comprar"],
          es: ["producto", "vino", "vinos", "catalogo", "comprar"],
          en: ["product", "wine", "wines", "catalog", "buy", "shop"]
        },
        responses: {
          ca: "Tenim una gran selecció de vins de proximitat! 🍷 Pots visitar la secció 'Productes' per veure tot el nostre catàleg. Busques algun tipus de vi en concret?",
          es: "¡Tenemos una gran selección de vinos de proximidad! 🍷 Puedes visitar la sección 'Productos' para ver todo nuestro catálogo. ¿Buscas algún tipo de vino en concreto?",
          en: "We have a great selection of local wines! 🍷 You can visit the 'Products' section to view our entire catalog. Are you looking for a specific type of wine?"
        }
      },
      {
        keywords: {
          ca: ["cistella", "carretó", "comanda"],
          es: ["cesta", "carrito", "pedido", "compra"],
          en: ["cart", "basket", "order", "checkout"]
        },
        responses: {
          ca: "Pots veure els productes que has afegit a la teva cistella a la pàgina 'Cistella' (🛒). Allà podràs revisar la teva comanda abans de procedir al pagament.",
          es: "Puedes ver los productos que has añadido a tu cesta en la página 'Cesta' (🛒). Allí podrás revisar tu pedido antes de proceder al pago.",
          en: "You can view the products you've added to your cart on the 'Cart' page (🛒). There you can review your order before proceeding to payment."
        }
      },
       {
        keywords: {
          ca: ["contacte", "suport", "ajuda", "email", "telèfon"],
          es: ["contacto", "soporte", "ayuda", "email", "telefono", "tlf"],
          en: ["contact", "support", "help", "email", "phone"]
        },
        responses: {
          ca: "Si necessites parlar amb un humà, pots trucar-nos al +34 937 12 34 56 o enviar un correu a info@inwine.cat. Estem disponibles de dilluns a divendres de 9:00 a 18:00.",
          es: "Si necesitas hablar con un humano, puedes llamarnos al +34 937 12 34 56 o enviar un correo a info@inwine.cat. Estamos disponibles de lunes a viernes de 9:00 a 18:00.",
          en: "If you need to speak with a human, you can call us at +34 937 12 34 56 or send an email to info@inwine.cat. We are available Monday to Friday from 9:00 to 18:00."
        }
      }
    ];

    // Find matching response in detected language
    for (const entry of knowledgeBase) {
      const keywords = entry.keywords[lang] || [];
      if (keywords.some(keyword => q.includes(keyword))) {
        return { text: entry.responses[lang], isFallback: false };
      }
    }

    // Default responses with fallback flag
    const defaultResponses = {
      ca: "Em sap greu, no he entès la teva pregunta ni he trobat informació específica a la meva base de dades. Però no et preocupis! Pots omplir aquest formulari i un membre del nostre equip et respondrà el més aviat possible via email.",
      es: "Lo siento, no he entendido tu pregunta ni he encontrado información específica en mi base de datos. ¡Pero no te preocupes! Puedes rellenar este formulario y un miembro de nuestro equipo te responderá lo antes posible vía email.",
      en: "I'm sorry, I didn't understand your question and couldn't find specific information in my database. But don't worry! You can fill out this form and a member of our team will respond as soon as possible via email."
    };

    return { 
        text: defaultResponses[lang] || defaultResponses['ca'],
        isFallback: true 
    };
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Chat Header */}
      <div className="bg-[#9A3E50] p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">InWine AI Assistant</h3>
          <p className="text-xs text-white/70">Sempre actiu</p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  m.role === "user"
                    ? "bg-[#9A3E50] text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </motion.div>
          ))}
          
          {/* Contact Form Fallback */}
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none shadow-sm w-full max-w-[90%] md:max-w-[80%]">
                 <h4 className="text-sm font-bold text-gray-900 mb-3">Formulari de Contacte</h4>
                 <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                        <input name="name" type="text" placeholder="Nom" required className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#9A3E50] outline-none" />
                    </div>
                    <div>
                        <input name="email" type="email" placeholder="Email" required className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#9A3E50] outline-none" />
                    </div>
                    <div>
                        <textarea name="message" rows="3" placeholder="Missatge" required className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#9A3E50] outline-none resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#9A3E50] text-white text-sm font-bold rounded-lg hover:bg-[#853444] transition-colors">
                        Enviar Missatge
                    </button>
                 </form>
              </div>
            </motion.div>
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#9A3E50] animate-spin" />
                <span className="text-xs text-gray-400 font-medium">L'IA està escrivint...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escriu un missatge..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9A3E50]/20 focus:border-[#9A3E50] outline-none transition-all text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 bg-[#9A3E50] text-white rounded-xl hover:bg-[#853444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#9A3E50]/10"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
