let myUrl = new URL(document.location.href);
let myParam = myUrl.searchParams.get("id");

let request = new XMLHttpRequest();
const mondaycarUrl = new URL(`https://api-staging.mondaycar.com/catalog/${myParam}`);

const getCar = () => {
  let request = new XMLHttpRequest();

  request.open("GET", mondaycarUrl, true);

  request.onload = function () {
    let res = JSON.parse(this.response);
    let car = res?.data;
    let leasePrices = leasePlan(car.leasePrices);

    if (request.status >= 200 && request.status < 400) {
      const carGrid = document.getElementById("car-grid");

      const carTitle = document.getElementById("car-title");
      carTitle.textContent = `${car.manufacturer} ${car.model}`;

      const carImage = document.getElementById("car-image");
      carImage.src = mainImage(car).uri;

      const carShift = document.getElementById("att-shift");
      carShift.textContent = car.transmission;

      const carFuel = document.getElementById("att-fuel");
      carFuel.textContent = car.fuel;

      const carDoors = document.getElementById("att-doors");
      carDoors.textContent = `${car.doors} Portes`;

      const carSeats = document.getElementById("att-seats");
      carSeats.textContent = `${car.seats} Places`;

      const carFeature = document.getElementById("att-feature");
      carFeature.textContent = "classique";

      const propType = document.getElementById("prop-type");
      propType.textContent = car.vehicleType;

      const propManufacturer = document.getElementById("prop-manufacturer");
      propManufacturer.textContent = car.manufacturer;

      const propModel = document.getElementById("prop-model");
      propModel.textContent = car.model;

      const propPower = document.getElementById("prop-power");
      propPower.textContent = car.power;

      const propYear = document.getElementById("prop-year");
      propYear.textContent = car.modelYear;

      const propFeatures = document.getElementById("prop-features");
      propFeatures.textContent =
        "Elle est équipée au moins de la climatisation manuelle, de la connexion bluetooth, d’une prise USB et du régulateur de vitesse.";

      const priceStart = document.getElementById("price-start");
      priceStart.textContent = `${printPrice(
        leasePrices.cheapest.amountInclVatMonthly
      )}/mois`;

      // LEASE PRICE SELECTOR BEGIN

      const leasePricesForm = document.getElementById("lease-prices-form-bis");
      let selectedUUID = leasePrices.cheapest.uuid;

      car.leasePrices.map((price) => {
        const leaseRadioShape = document.createElement("div");
        leaseRadioShape.setAttribute("class", "lease-radio-shape");

        const radio = document.createElement("input");
        radio.setAttribute("id", price.uuid);
        radio.setAttribute("class", "lease-radio-button");
        radio.type = "radio";
        radio.name = "commitment";
        radio.value = price.uuid;
        radio.checked = price.uuid === selectedUUID;

        const label = document.createElement("label");
        label.setAttribute("class", "lease-radio-price");
        label.textContent = `${printPrice(
          price.amountInclVatMonthly
        )} par mois`;
        label.htmlFor = price.uuid;

        const commitmentPeriod = document.createElement("div");
        commitmentPeriod.setAttribute("class", "lease-radio-commitment");
        commitmentPeriod.textContent = price.commitmentDurationInMonths
          ? price.commitmentDurationInMonths + " mois"
          : "Sans engagement";

        if (radio.checked) {
          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";
          commitmentPeriod.style.color = "#32e0c4";
        }

        const commitmentRecap = document.getElementById("recap-commitment");
        const commitmentRecapTitle = document.getElementById(
          "recap-commitment-title"
        );
        const commitmentRecapValue = document.getElementById(
          "recap-commitment-value"
        );

        commitmentRecapTitle.textContent = `Engagement ${leasePrices.cheapest.commitmentDurationInMonths} mois`;
        commitmentRecapValue.textContent = `${printPrice(
          leasePrices.cheapest.amountInclVatMonthly
        )}/mois`;

        const configTotalPrice = document.getElementById("config-total-price");

        const configTotalCommitment = document.getElementById(
          "config-total-commitment"
        );

        const configTotalSaving = document.getElementById(
          "config-total-saving"
        );
        
        const configDeposit = document.getElementById(
          "config-disclaimer-deposit"
        );

        configTotalPrice.textContent = `${printPrice(
          leasePrices.cheapest.amountInclVatMonthly
        )}/mois`;
        configTotalCommitment.textContent =
          leasePrices.cheapest.commitmentDurationInMonths;

        configTotalSaving.textContent = `d'économiser ${printPrice(
          (leasePrices.expensive.amountInclVatMonthly -
            leasePrices.cheapest.amountInclVatMonthly) *
              leasePrices.cheapest.commitmentDurationInMonths
        )}`;
        
        configDeposit.textContent = printPrice(
          leasePrices.expensive.amountInclVatMonthly
        );

        radio.addEventListener("change", function () {
          commitmentRecapTitle.textContent = price.commitmentDurationInMonths
            ? `Engagement ${price.commitmentDurationInMonths} mois`
            : `Sans engagement`;
          commitmentRecapValue.textContent = `${printPrice(
            price.amountInclVatMonthly
          )}/mois`;

          configTotalPrice.textContent = `${printPrice(
            price.amountInclVatMonthly
          )}/mois`;

          configTotalCommitment.textContent = price.commitmentDurationInMonths;

          configTotalSaving.textContent = `d'économiser ${printPrice(
            (leasePrices.expensive.amountInclVatMonthly -
              price.amountInclVatMonthly) * price.commitmentDurationInMonths
          )}`;

          commitmentRecap.appendChild(commitmentRecapTitle);
          commitmentRecap.appendChild(commitmentRecapValue);

          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";
          commitmentPeriod.style.color = "#32e0c4";

          var allRadiosQuery = document.querySelectorAll(
            'input[name="commitment"]'
          );
          for (
            var i = 0, len = allRadiosQuery.length | 0;
            i < len;
            i = (i + 1) | 0
          ) {
            if (!allRadiosQuery[i].checked) {
              const unchekedCommitment = allRadiosQuery[i].nextElementSibling;
              const unchekedLabel = unchekedCommitment.nextElementSibling;
              unchekedLabel.style.color = "#747f90";
              unchekedLabel.style.border = "1px solid #747f90";
              unchekedCommitment.style.color = "#747f90";
            }
          }
        });

        leaseRadioShape.appendChild(radio);
        leaseRadioShape.appendChild(commitmentPeriod);
        leaseRadioShape.appendChild(label);

        leasePricesForm.appendChild(leaseRadioShape);

        //TODO : SET THE CHOSEN ONE IN SESSION STORAGE

        // LEASE PRICE SELECTOR END
      });

      // MILEAGE PRICE SELECTOR BEGIN

      const selector = document.getElementById("mileage-select");

      // Create an option for each mileage price
      console.log(car.mileagePrices);
      car.mileagePrices
        .sort(
          (priceA, priceB) =>
            priceA.allowedMileageMonthly - priceB.allowedMileageMonthly
        )
        .forEach((price) => {
          const { allowedMileageMonthly, amountInclVatMonthly } = price;
          let option = document.createElement("option");
          option.text = amountInclVatMonthly
            ? `${allowedMileageMonthly}km/mois (${printPrice(
                amountInclVatMonthly
              )})`
            : `${allowedMileageMonthly}km/mois (inclus)`;
          option.value = `${price.amountInclVatMonthly},${price.allowedMileageMonthly}`;

          selector.add(option);
        });

      const mileageRecap = document.getElementById("recap-mileage");
      const mileageRecapTitle = document.getElementById("recap-mileage-title");
      const mileageRecapValue = document.getElementById("recap-mileage-value");

      mileageRecap.appendChild(mileageRecapTitle);
      mileageRecap.appendChild(mileageRecapValue);

      mileageRecapTitle.textContent = `Forfait 1000km/mois`;
      mileageRecapValue.textContent = "inclus";

      selector.addEventListener("change", (e) => {
        const [amountInclVatMonthly, allowedMileageMonthly] =
          e.target.value.split(",");
        mileageRecapTitle.textContent = `Forfait ${allowedMileageMonthly}km/mois`;
        mileageRecapValue.textContent = amountInclVatMonthly
          ? `+ ${printPrice(amountInclVatMonthly)}/mois`
          : "ìnclus";
      });

      //TODO : SET THE CHOSEN ONE IN SESSION STORAGE

      // MILEAGE PRICE SELECTOR END

      // INSURANCE SELECTOR BEGIN

      const insuranceForm = document.getElementById("insurance-selector");
      const insuranceOptions = [
        {
          uuid: "mondaycar",
          title: "Vous m’assurez",
          description: "J’utilise l’assurance tous risques de mondaycar",
        },
        {
          uuid: "customer",
          title: "Je m’assure",
          description: "J’utilise ma propre solution d’assurance tous risques.",
        },
      ];

      let selectedInsuranceUUID = insuranceOptions[0].uuid;

      insuranceOptions.map((option) => {
        const insuranceRadioShape = document.createElement("div");
        insuranceRadioShape.setAttribute("class", "insurance-radio-shape");

        const radio = document.createElement("input");
        radio.setAttribute("id", option.uuid);
        radio.setAttribute("class", "insurance-radio-button");
        radio.type = "radio";
        radio.name = "insurance";
        radio.value = option.uuid;
        radio.checked = option.uuid === selectedInsuranceUUID;

        const label = document.createElement("label");
        label.setAttribute("class", "insurance-label");
        label.textContent = option.title;
        label.htmlFor = option.uuid;

        const span = document.createElement("span");
        span.setAttribute("class", "insurance-desc");
        span.textContent = option.description;

        if (radio.checked) {
          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";
        }

        radio.addEventListener("change", function (e) {
          const insuranceCollapse =
            document.getElementById("insurance-collapse");
          if (e.target.value !== "mondaycar") {
            insuranceCollapse.style.display = "none";
          } else {
            insuranceCollapse.style.display = "block";
          }

          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";

          var allRadiosQuery = document.querySelectorAll(
            'input[name="insurance"]'
          );
          for (
            var i = 0, len = allRadiosQuery.length | 0;
            i < len;
            i = (i + 1) | 0
          ) {
            if (!allRadiosQuery[i].checked) {
              const unchekedLabel = allRadiosQuery[i].nextElementSibling;
              unchekedLabel.style.color = "#747f90";
              unchekedLabel.style.border = "1px solid #747f90";
            }
          }
        });

        label.appendChild(span);

        insuranceRadioShape.appendChild(radio);
        insuranceRadioShape.appendChild(label);

        insuranceForm.appendChild(insuranceRadioShape);

        //TODO : SET THE CHOSEN ONE IN SESSION STORAGE

        // LEASE PRICE SELECTOR END
      });
    }
  };

  request.send();
};

(function () {
  getCar();
})();
