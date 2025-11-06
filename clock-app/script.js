const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("second");
const digital = document.getElementById("digital");

function updateClock() {
  const now = new Date();

  // Time values
  const hr = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();

  // Calculate rotation degrees
  const hourDeg = (hr % 12) * 30 + min * 0.5; // 360/12 = 30
  const minuteDeg = min * 6; // 360/60 = 6
  const secondDeg = sec * 6; // 360/60 = 6

  // Rotate clock hands
  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;

  // Digital clock format
  const ampm = hr >= 12 ? "PM" : "AM";
  const formattedHour = hr % 12 || 12;
  const timeString = `${String(formattedHour).padStart(2, "0")}:${String(
    min
  ).padStart(2, "0")}:${String(sec).padStart(2, "0")} ${ampm}`;
  digital.textContent = timeString;
}

// Update every second
setInterval(updateClock, 1000);
updateClock();
