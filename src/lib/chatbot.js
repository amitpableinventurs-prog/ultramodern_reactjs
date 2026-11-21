import { emailjsConfig } from "../data/site.js";

// same EmailJS service the live site's chat assistant uses
const EMAILJS_SERVICE_ID = "service_qb3etcn";
const EMAILJS_TEMPLATE_ID = "template_w9uxsdr";

const SERVICES_DB = {
    "Online Marketing": [
        "SEO Services",
        "Social Media Marketing",
        "Google Ads",
        "Meta Ads",
        "Google MY Business Profile",
        "Digital Marketing"
    ],
    "Web Design & Development": [
        "Web Design & Development",
        "Educational Web Portal Development",
        "Restaurant Web Portal Development",
        "Health Care Portal Development",
        "Travel Portal Development",
        "Real Estate Portal Development",
        "E-Commerce Website Development"
    ],
    "Mobile Application": [
        "Mobile App Development",
        "Windows App Development",
        "Xamarin App Development",
        "Native App Development",
        "Hybrid App Development"
    ],
    "Software Development": [
        "CRM Software Development",
        "Software Development"
    ],
    "Software Solutions": [
        "HR and Payroll Management Software",
        "Jewellery Software",
        "CRM Software",
        "Real Estate Software",
        "Inventory Management Software",
        "Hospital Management Software",
        "School Management Software"
    ],
    "IT Consulting": [
        "IT Consulting",
        "Data Analytics & Business Intelligence",
        "Artificial Intelligence & Machine Learning",
        "IT Support & Managed Service",
        "Logo Design",
        "UI/UX Design",
        "Brochure Design"
    ],
    "Testing Services": [
        "Software Testing",
        "Security Testing",
        "Performance Testing"
    ]
};

class UltraModernChatbot {

    constructor() {
        this.aiButton = document.getElementById("aiBotButton");
        this.chatWindow = document.getElementById("chatWindow");
        this.chatMessages = document.getElementById("chatMessages");
        this.chatInput = document.getElementById("chatInput");
        this.sendBtn = document.getElementById("sendChatBtn");
        this.closeBtn = document.getElementById("closeChatBtn");
        this.clearBtn = document.getElementById("clearHistoryBtn");
        this.badge = document.querySelector(".bot-badge");
        this.customFillBtn = document.getElementById("customFillBtn");

        this.flow = {
            step: "category",
            category: "",
            service: "",
            businessType: "",
            budget: "",
            timeline: "",
            customRequirement: ""
        };

        this.isCustomFlow = false;
        this.init();
    }

    init() {
        this.chatInput.disabled = true;

        this.aiButton?.addEventListener("click", () => {
            this.chatWindow.classList.toggle("open");
            if (this.chatWindow.classList.contains("open")) {
                this.hideBadge();
            }
        });

        this.closeBtn?.addEventListener("click", () => {
            this.chatWindow.classList.remove("open");
        });

        this.clearBtn?.addEventListener("click", () => {
            this.clearHistory();
        });

        // Quick options buttons (including custom request at top bar)
        document.querySelectorAll(".quick-option-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                // If custom fill button at top is clicked
                if (btn.id === "customFillBtn") {
                    this.startCustomFillFromTop();
                    return;
                }
                // If any other category button is clicked
                document.querySelectorAll(".quick-option-btn").forEach(b =>
                    b.classList.remove("active")
                );
                btn.classList.add("active");
                this.handleFlow(btn.dataset.category);
            });
        });

        // Handle flow buttons (dynamic options)
        document.addEventListener("click", (e) => {
            if (!this.chatWindow.isConnected) return; // stale instance after the page layout was re-mounted
            const btn = e.target.closest(".flow-btn");
            if (!btn) return;
            
            // Handle custom submit/skip buttons
            if (btn.id === "customSubmitBtn") {
                this.handleCustomSubmit();
                return;
            }
            if (btn.id === "customSkipBtn") {
                this.resetCustomFlow();
                return;
            }
            
            // Handle "Custom Request" option from service list
            if (btn.dataset.value === "✏️ Custom Request") {
                this.startCustomFillFromService();
                return;
            }
            
            this.handleFlow(btn.dataset.value);
        });

        this.sendBtn?.addEventListener("click", () => {
            this.handleUserInput();
        });

        this.chatInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.handleUserInput();
            }
        });
    }

    hideBadge() {
        if (this.badge) {
            this.badge.style.display = "none";
        }
    }

    getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    addMessage(text, isUser = false) {
        const time = this.getTimestamp();

        if (isUser) {
            const div = document.createElement("div");
            div.className = "message user-msg";
            div.innerHTML = `
                <div class="msg-bubble">${text.replace(/\n/g, "<br>")}</div>
                <span class="msg-time">${time}</span>
            `;
            this.chatMessages.appendChild(div);
        } else {
            const div = document.createElement("div");
            div.className = "message bot-msg";
            div.innerHTML = `
                <div class="bot-msg-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="msg-content">
                    <div class="msg-bubble">${text.replace(/\n/g, "<br>")}</div>
                    <span class="msg-time">${time}</span>
                </div>
            `;
            this.chatMessages.appendChild(div);
        }

        this.scrollToBottom();
    }

    addHTMLMessage(html) {
        const time = this.getTimestamp();
        const div = document.createElement("div");
        div.className = "message bot-msg";
        div.innerHTML = `
            <div class="bot-msg-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="msg-content">
                <div class="msg-bubble">${html}</div>
                <span class="msg-time">${time}</span>
            </div>
        `;
        this.chatMessages.appendChild(div);
        this.scrollToBottom();
    }

    showTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot-msg typing-indicator";
        typingDiv.innerHTML = `
            <div class="bot-msg-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="msg-content">
                <div class="typing">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    removeTyping(typingEl) {
        if (typingEl && typingEl.parentNode) {
            typingEl.remove();
        }
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        });
    }

    createButtons(options, includeCustom = false) {
        let html = `<div class="chat-options">`;
        options.forEach(option => {
            html += `
                <button
                    type="button"
                    class="flow-btn"
                    data-value="${option}">
                    ${option}
                </button>
            `;
        });
        
        // Add Custom Request option at the end of service list with special styling
        if (includeCustom) {
            html += `
                <button
                    type="button"
                    class="flow-btn custom-request-option"
                    data-value="Custom Request"
                    >
                     Custom Request
                </button>
            `;
        }
        
        html += `</div>`;
        this.addHTMLMessage(html);
    }

    // ============================================
    // CUSTOM FILL METHODS
    // ============================================

    // Start custom fill from top bar button
    startCustomFillFromTop() {
        // Highlight the custom button
        document.querySelectorAll(".quick-option-btn").forEach(b =>
            b.classList.remove("active")
        );
        this.customFillBtn.classList.add("active");
        
        this.isCustomFlow = true;
        this.flow.step = "custom_service";
        this.flow.category = "Custom Request";
        
        this.addMessage("✏️ Great! Tell us about your custom requirement.");
        
        this.showCustomInputForm();
    }

    // Start custom fill from service list
    startCustomFillFromService() {
        // Add user message
        this.addMessage("✏️ Custom Request", true);
        
        this.isCustomFlow = true;
        this.flow.step = "custom_service";
        this.flow.category = "Custom Request";
        
        this.addMessage("✏️ Tell us about your custom requirement.");
        
        this.showCustomInputForm();
    }

    showCustomInputForm() {
        const html = `
            <div class="custom-fill-wrapper">
                <div class="custom-fill-intro">
                    <i class="fas fa-lightbulb" style="color: var(--blue-dark);"></i>
                    <span>Describe your project or requirement in detail</span>
                </div>
                <textarea 
                    id="customRequirementInput" 
                    class="custom-requirement-input"
                    placeholder="Example: I need a custom CRM for my real estate business with lead tracking, automated follow-ups, and reporting dashboard..."
                    rows="4"
                ></textarea>
                <div class="custom-fill-actions">
                    <button class="flow-btn custom-submit-btn" id="customSubmitBtn">
                        <i class="fas fa-paper-plane"></i> Submit Requirement
                    </button>
                   
                </div>
                <small class="custom-hint">
                    <i class="fas fa-info-circle"></i>
                    Be as specific as possible for the best recommendations
                </small>
            </div>
        `;
        
        this.addHTMLMessage(html);
        
        // Focus the textarea
        const textarea = document.getElementById("customRequirementInput");
        if (textarea) {
            setTimeout(() => textarea.focus(), 300);
        }
        
        // Add Enter key handler
        textarea?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.handleCustomSubmit();
            }
        });
    }

    async handleCustomSubmit() {
        const textarea = document.getElementById("customRequirementInput");
        if (!textarea) return;
        
        const requirement = textarea.value.trim();
        if (!requirement) {
            textarea.style.borderColor = "#ff4757";
            textarea.style.boxShadow = "0 0 0 3px rgba(255, 71, 87, 0.15)";
            textarea.placeholder = "⚠️ Please describe your requirement...";
            setTimeout(() => {
                textarea.style.borderColor = "";
                textarea.style.boxShadow = "";
                textarea.placeholder = "Example: I need a custom CRM for my real estate business...";
            }, 2000);
            return;
        }
        
        // Show typing indicator
        const typing = this.showTyping();
        await this.delay(800 + Math.random() * 400);
        this.removeTyping(typing);
        
        // Store custom requirement
        this.flow.customRequirement = requirement;
        this.flow.service = "Custom Requirement";
        
        this.addMessage(
            `✅ Got it! I'll analyze your requirement:\n\n"${requirement}"`
        );
        
        // Continue with normal flow - move to business step
        this.isCustomFlow = false;
        this.flow.step = "business";
        
        // Continue with the normal flow
        await this.delay(500);
        this.addMessage(
            `Excellent! 🏢\n\nWhat best describes your organization?`
        );
        this.createButtons([
            "🚀 Startup",
            "🏪 Small Business",
            "🏢 Enterprise",
            "🎯 Agency",
            "👤 Individual"
        ]);
    }

    resetCustomFlow() {
        this.isCustomFlow = false;
        this.flow.step = "category";
        
        // Remove active state from custom button
        this.customFillBtn.classList.remove("active");
        
        // Enable quick options again
        document.querySelectorAll(".quick-option-btn").forEach(b => {
            if (b !== this.customFillBtn) {
                b.classList.remove("active");
            }
        });
        
        this.addMessage("👋 Going back. Please select a service category above.");
    }

    // ============================================
    // MAIN FLOW HANDLER
    // ============================================

    async handleFlow(value) {
        // If in custom flow, don't process category clicks
        if (this.isCustomFlow && this.flow.step === "custom_service") {
            return;
        }
        
        this.addMessage(value, true);
        
        // Show typing indicator
        const typing = this.showTyping();
        await this.delay(600 + Math.random() * 400);
        this.removeTyping(typing);
        
        switch (this.flow.step) {
            case "category":
                this.flow.category = value;
                this.flow.step = "service";
                
                this.addMessage(
                    `Great choice! 🎯\n\nWhich ${value} service interests you?`
                );
                // Include Custom Request option at the end of service list
                this.createButtons(SERVICES_DB[value], true);
                break;
                
            case "service":
                this.flow.service = value;
                this.flow.step = "business";
                
                this.addMessage(
                    `Excellent! 🏢\n\nWhat best describes your organization?`
                );
                this.createButtons([
                    "🚀 Startup",
                    "🏪 Small Business",
                    "🏢 Enterprise",
                    "🎯 Agency",
                    "👤 Individual"
                ]);
                break;
                
            case "business":
                this.flow.businessType = value;
                this.flow.step = "budget";
                
                this.addMessage(
                    `Got it! 💰\n\nWhat's your estimated budget for this project?`
                );
                this.createButtons([
                    "Under ₹50,000",
                    "₹50,000 - ₹2,00,000",
                    "₹2,00,000 - ₹5,00,000",
                    "Above ₹5,00,000"
                ]);
                break;
                
            case "budget":
                this.flow.budget = value;
                this.flow.step = "timeline";
                
                this.addMessage(
                    `Perfect! ⏰\n\nWhen would you like to get started?`
                );
                this.createButtons([
                    "🔥 Immediately",
                    "📅 Within 30 Days",
                    "🗓️ Within 3 Months",
                    "🔍 Just Exploring"
                ]);
                break;
                
            case "timeline":
                this.flow.timeline = value;
                this.flow.step = "contact";
                this.showLeadForm();
                break;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLeadForm() {
        const html = `
            <div class="lead-form-wrapper">
                <p>
                    <i class="fas fa-clipboard-check" style="color: var(--blue-dark); margin-right: 6px;"></i>
                    Almost done! Please share your details.
                </p>

                <form id="leadForm" class="lead-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="👤  Your Full Name"
                        required>

                    <input
                        type="email"
                        name="email"
                        placeholder="📧  Email Address"
                        required>

                    <input
                        type="tel"
                        name="phone"
                        placeholder="📱  Phone Number"
                        required>

                    <input
                        type="text"
                        name="company"
                        placeholder="🏢  Company Name (Optional)">
                </form>

                <small>
                    <i class="fas fa-lock" style="margin-right: 4px;"></i>
                    Your info is secure. Fill details & click
                    <strong>Send</strong>.
                </small>
            </div>
        `;

        this.addHTMLMessage(html);

        this.chatInput.disabled = false;
        this.chatInput.placeholder = "Click Send to submit your details →";
        this.chatInput.focus();
    }

    async handleUserInput() {
        if (this.flow.step !== "contact") return;
        
        const form = document.getElementById("leadForm");
        if (!form) return;
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const leadData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            company: form.company.value.trim()
        };
        
        const templateParams = {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            company: leadData.company,
            category: this.flow.category || "Custom Request",
            service: this.flow.service || "Custom Requirement",
            business_type: this.flow.businessType || "N/A",
            budget: this.flow.budget || "N/A",
            timeline: this.flow.timeline || "N/A",
            custom_requirement: this.flow.customRequirement || "N/A"
        };
        
        this.sendBtn.disabled = true;
        this.sendBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        
        const typing = this.showTyping();
        
        try {
            const { default: emailjs } = await import("@emailjs/browser");
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                { publicKey: emailjsConfig.publicKey }
            );
            
            this.removeTyping(typing);
            
            const serviceDisplay = this.flow.customRequirement ? 
                `your custom requirement` : 
                `**${this.flow.service}**`;
            
            this.addMessage(
                `✅ Thank you, ${leadData.name}! 🎉\n\nYour request for ${serviceDisplay} has been received.\n\n📞 Our team will contact you within 24 hours.\n\n💡 Feel free to explore other services!`
            );
            
            form.reset();
            this.resetFlow();
            
            this.chatInput.value = "";
            this.chatInput.disabled = true;
            this.chatInput.placeholder = "Complete the steps above...";
            
            document.querySelectorAll(".quick-option-btn").forEach(b =>
                b.classList.remove("active")
            );
            
            this.isCustomFlow = false;
            
        } catch (error) {
            console.error("EmailJS Error:", error);
            this.removeTyping(typing);
            
            this.addMessage(
                "❌ Oops! Something went wrong.\n\nPlease try again or contact us directly."
            );
        } finally {
            this.sendBtn.disabled = false;
            this.sendBtn.innerHTML = `<i class="fas fa-paper-plane"></i>`;
        }
    }

    resetFlow() {
        this.flow = {
            step: "category",
            category: "",
            service: "",
            businessType: "",
            budget: "",
            timeline: "",
            customRequirement: ""
        };
        this.isCustomFlow = false;
    }

    clearHistory() {
        /* Add smooth fade out animation */
        this.chatMessages.style.opacity = "0";
        this.chatMessages.style.transform = "translateY(10px)";

        setTimeout(() => {
            this.chatMessages.innerHTML = `
                <div class="message bot-msg">
                    <div class="bot-msg-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="msg-content">
                        <div class="msg-bubble">
                            <span class="wave-emoji">👋</span>
                            <strong>Welcome to UltraModern Technologies</strong>
                            <br><br>
                            Tell us what you're looking for and we'll recommend the right solution.
                            <br><br>
                            <div class="info-chip">
                                <i class="fas fa-clock"></i>
                                Takes less than 1 minute
                            </div>
                            <br>
                            <span class="hint-text">
                                <i class="fas fa-hand-pointer"></i>
                                Select a service category above to begin
                            </span>
                            <br>
                            <span class="hint-text">
                                <i class="fas fa-pen-fancy"></i>
                                Or use <strong>Custom Request</strong> for specific needs
                            </span>
                        </div>
                        <span class="msg-time">Just now</span>
                    </div>
                </div>
            `;

            this.resetFlow();

            this.chatInput.disabled = true;
            this.chatInput.value = "";
            this.chatInput.placeholder = "Complete the steps above...";

            /* Remove active state from quick options */
            document.querySelectorAll(".quick-option-btn").forEach(b =>
                b.classList.remove("active")
            );

            /* Fade back in */
            this.chatMessages.style.transition = "all 0.3s ease";
            this.chatMessages.style.opacity = "1";
            this.chatMessages.style.transform = "translateY(0)";
        }, 200);
    }
}

let instance = null;

/** Start the assistant once the markup from Chatbot.jsx is in the page (safe to call repeatedly). */
export function initChatbot() {
    if (instance && instance.chatWindow.isConnected) return;
    instance = new UltraModernChatbot();
}