export const setupEmojiPicker = (container, inputField) => {
    const toggleBtn = container.querySelector(".emoji-toggle");
    const pickerPanel = container.querySelector(".emoji-picker");
    const emojiButtons = pickerPanel.querySelectorAll(".emoji");

    toggleBtn.addEventListener("click", () => {
        pickerPanel.classList.toggle("hidden");
    });

    for (const btn of emojiButtons) {
        btn.addEventListener("click", () => {
            inputField.value += btn.textContent;
            inputField.focus();
        });
    }
};
