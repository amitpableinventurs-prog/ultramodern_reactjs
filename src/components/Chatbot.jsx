import { useEffect } from 'react';
import { initChatbot } from '../lib/chatbot.js';
import '../styles/chatbot.css';

/**
 * "Service Assistant": the guided enquiry chat that runs on the live site.
 * The markup is the original one; lib/chatbot.js drives it (category > service > details > lead form,
 * and the lead is e-mailed through EmailJS).
 */
export default function Chatbot() {
  useEffect(() => { initChatbot(); }, []);
  return (
    <>
      <div className="ai-bot-button" id="aiBotButton">
              <img src="/logo/businessman.png" alt="Service Assistant" style={{ width: 54, display: 'flex' }} />
              <span className="bot-badge">1</span>
          </div>

          <div className="chat-window" id="chatWindow">

              <div className="chat-header">
                  <div className="header-left">
                      <div className="bot-avatar">
                          <i className="fas fa-robot"></i>
                          <span className="status-dot"></span>
                      </div>
                      <div className="header-info">
                          <h4>Service Assistant</h4>
                          <span className="status-text">Online • Ready to help</span>
                      </div>
                  </div>

                  <div className="header-actions">
                      <button type="button" id="clearHistoryBtn" title="Start Over">
                          <i className="fas fa-redo-alt"></i>
                      </button>
                      <button type="button" id="closeChatBtn" title="Close">
                          <i className="fas fa-times"></i>
                      </button>
                  </div>
              </div>

              <div className="quick-options-bar" id="quickOptionsBar">
                  <div className="quick-options-scroll">
                      <button type="button" className="quick-option-btn" data-category="Online Marketing">
                          <i className="fas fa-chart-line"></i>
                          <span>Online Marketing</span>
                      </button>

                      <button type="button" className="quick-option-btn" data-category="Web Design & Development">
                          <i className="fas fa-code"></i>
                          <span>Web Development</span>
                      </button>

                      <button type="button" className="quick-option-btn" data-category="Mobile Application">
                          <i className="fas fa-mobile-alt"></i>
                          <span>Mobile Apps</span>
                      </button>

                      <button type="button" className="quick-option-btn" data-category="Software Development">
                          <i className="fas fa-laptop-code"></i>
                          <span>Software Dev</span>
                      </button>

                      <button type="button" className="quick-option-btn" data-category="Software Solutions">
                          <i className="fas fa-database"></i>
                          <span>Software</span>
                      </button>

                      <button type="button" className="quick-option-btn" data-category="IT Consulting">
                          <i className="fas fa-brain"></i>
                          <span>IT Consulting</span>
                      </button>

                      <button type="button" className="quick-option-btn" data-category="Testing Services">
                          <i className="fas fa-vial"></i>
                          <span>Testing</span>
                      </button>


                  </div>
              </div>

              <div className="chat-messages" id="chatMessages">
                  <div className="message bot-msg">
                      <div className="bot-msg-avatar">
                          <i className="fas fa-robot"></i>
                      </div>
                      <div className="msg-content">
                          <div className="msg-bubble">
                              <span className="wave-emoji">👋</span>
                              <strong>Welcome to UltraModern Technologies</strong>
                              <br /><br />
                              Tell us what you're looking for and we'll recommend the right solution.
                              <br /><br />
                              <div className="info-chip">
                                  <i className="fas fa-clock"></i>
                                  Takes less than 1 minute
                              </div>
                              <br />
                              <span className="hint-text">
                                  <i className="fas fa-hand-pointer"></i>
                                  Select a service category above to begin
                              </span>
                              <br />
                              <span className="hint-text">
                                  <i className="fas fa-pen-fancy"></i>
                                  Or use <strong>Custom Request</strong> for specific needs
                              </span>
                          </div>
                          <span className="msg-time">Just now</span>
                      </div>
                  </div>
              </div>

              <div className="chat-input-area">
                  <div className="input-wrapper">
                      <input type="text" id="chatInput" placeholder="Complete the steps above..." autoComplete="off" disabled />
                      <button id="sendChatBtn" type="button">
                          <i className="fas fa-paper-plane"></i>
                      </button>
                  </div>
                  <div className="powered-by">
                      <i className="fas fa-shield-alt"></i>
                      Powered by UltraModern Technologies
                  </div>
              </div>
          </div>
    </>
  );
}
