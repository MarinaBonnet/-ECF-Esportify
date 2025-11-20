// modules/adminDashboard.js
export async function initAdminDashboard() {
  try {
    // 🔹 Récupération des données depuis ton API PHP
    const response = await fetch("/api/admin/dashboard.php"); // <-- mets ton endpoint ici
    const data = await response.json();

    // 🔹 Injection dans les métriques
    document.getElementById("event-count").textContent = data.eventsCreated;
    document.getElementById("participant-count").textContent =
      data.participants;
    document.getElementById("suspended-count").textContent = data.suspended;

    // 🔹 Graphique Chart.js
    const ctx = document.getElementById("eventChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Événements créés", "Participants", "Suspendus"],
        datasets: [
          {
            label: "Statistiques globales",
            data: [data.eventsCreated, data.participants, data.suspended],
            backgroundColor: ["#4caf50", "#2196f3", "#f44336"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Pilotage des événements" },
        },
      },
    });
  } catch (err) {
    console.error("⚠️ Erreur dashboard admin :", err);
  }
}
