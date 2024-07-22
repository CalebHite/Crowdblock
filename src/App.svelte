<script>
    import { onMount } from "svelte";
    import { connectWallet, connectContract, createFundraiser, donate, startQuadraticFunding, getFundraisers, removeFundraiser } from "./web3";

    let fundraisers = [];
    let fundraiserName = "";
    let selectedFundraiser = "";
    let donationAmount = "";
    let selectedFundraiserId = 0;

    let page = "";

    onMount(async () => {
        try {
            await connectContract();
            await connectWallet();
            fundraisers = await getFundraisers();
        } catch(err){
            console.log(err);
        }
    });

    async function handleCreateFundraiser() {
        try {
            await createFundraiser(fundraiserName);
            fundraisers = await getFundraisers();
            fundraiserName = "";
        } catch (error) {
            console.error("Failed to create fundraiser:", error);
        }
    }

    async function handleDonate() {
        try {
            await donate(selectedFundraiserId, donationAmount);
            fundraisers = await getFundraisers();
            donationAmount = "";
        } catch (error) {
            console.error("Failed to donate:", error);
        }
    }

    async function handleStartQuadraticFunding() {
        try {
            await startQuadraticFunding(selectedFundraiserId);
        } catch (error) {
            console.error("Failed to start quadratic funding:", error);
        }
    }

    async function handleRemoveFundraiser() {
        try {
            console.log("Removing fundraiser with ID:", selectedFundraiserId);
            await removeFundraiser(selectedFundraiserId);
            fundraisers = await getFundraisers();
            selectedFundraiserId = 0; // Reset selection
        } catch (error) {
            console.error("Failed to remove fundraiser:", error);
        }
    }
</script>

<main>
    <h1 id="title">Crowdblock</h1>
        <button on:click={()=>{
            page = "donate";
        }}>
            Donate
        </button>
        <button on:click={()=>{
            page = "create";
        }}>
            Create
        </button>
    { #if page == "donate"}
        <section>
            <h2>Select Fundraiser:</h2>
            <select bind:value={selectedFundraiser} name="" id="">
                {#each fundraisers as fundraiser, index}
                    <option on:click={ ()=>{
                        selectedFundraiserId = index;
                    }} value={index}>{fundraiser.name}</option>
                {/each}
            </select>
        </section>
        <section>
            <h2>Donate Directly</h2>
            $<input bind:value={donationAmount} placeholder="Amount in ETH" />
            <button on:click={handleDonate}>Donate</button>
        </section>
        <section>
            <h2>Start Quadratic Funding</h2>
            <button id="start" on:click={handleStartQuadraticFunding}>Start</button>
        </section>
    { /if}

    { #if page == "create"}
        <section>
            <h2>Create Fundraiser</h2>
            <input bind:value={fundraiserName} placeholder="Fundraiser Name" />
            <button on:click={handleCreateFundraiser}>Create</button>
        </section>
    { /if}
</main>

<style>
    main {
        background: #151b29;
        color: whitesmoke; 
        padding: 2rem;
        width: 100%;
        height: 60rem;
        text-align: center;
        align-items: center;
    }
    
    button:hover{
        background: #72d4a1;
    }

    #title{
        font-size: 4rem;
        color: #72d4a1;
    }

    section {
        margin-top: 1rem;
        margin-bottom: 1rem;
        background: #2a3652;
        width: 25rem;
        padding: 1rem 0 1rem 0;
        border-radius: .5rem;
        margin-left: 37%;
    }

    input {
        margin-right: 1rem;
    }

    select {
        margin-right: 1rem;
    }

    #start{
        width: 25%;
    }
</style>
