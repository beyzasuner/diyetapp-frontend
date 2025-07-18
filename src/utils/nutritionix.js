import axios from "axios";

export const fetchMakrolar = async (query) => {
  try {
    const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          "x-app-id": "375c5757",
          "x-app-key": "296e1dab255d60859869b13239c2414a"
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
      console.warn("Makro verisi boş geldi:", data);
      return null;
    }

    const food = data.foods[0];
    return {
      karbonhidrat: food.nf_total_carbohydrate || 0,
      protein: food.nf_protein || 0,
      yag: food.nf_total_fat || 0
    };
  } catch (error) {
    console.error("❌ Nutritionix API hatası:", error);
    return null;
  }
};


