<template>
  <section id="about">
    <div class="about-left">
      <div class="row-header">
        <h2>
          mint<span class="mint-blue">team</span>
          <ArrowDownBlack class="arrow-down" />
        </h2>
      </div>
      <div class="about-box">
        <div class="team-box">
          <div class="team-image">
            <img src="/Anne_Krauwer.jpeg" alt="Anne Krauwer" />
          </div>
          <div class="team-about-box">
            <div class="team-name">Anne Krauwer</div>
            <div class="team-job">Visual Designer</div>
          </div>
        </div>
        <div class="team-box">
          <div class="team-image">
            <img src="/0xWebMoss.png" alt="Craig Moss" />
          </div>
          <div class="team-about-box">
            <div class="team-name">Craig Moss</div>
            <div class="team-job">Fullstack Web3 Developer</div>
          </div>
        </div>
        <div class="team-box">
          <div class="team-image">
            <img src="/Mourad_Bouabdallah.jpeg" alt="Mourad Bouabdallah" />
          </div>
          <div class="team-about-box">
            <div class="team-name">Mourad Bouabdallah</div>
            <div class="team-job">Software Engineer</div>
          </div>
        </div>
        <div class="team-box">
          <div class="team-image">
            <img src="/Nobuhito_Kurose.jpeg" alt="Nobuhito Kurose" />
          </div>
          <div class="team-about-box">
            <div class="team-name">Nobuhito Kurose</div>
            <div class="team-job">Software Engineer</div>
          </div>
        </div>
      </div>
    </div>
    <div class="about-right">
      <div class="sponsors-box">
        <div class="sponsor-box">
          <div class="sponsor-about-box">
            <div class="sponsor-name">
              <a
                href="https://github.com/Mint-Tea-ETHOnline"
                alt="GitHub"
                target="_blank"
                rel="noopener"
                >GitHub repository</a
              >
            </div>
          </div>
          <div class="sponsor-image">
            <img src="/GitHub_Logo.png" alt="GitHub" />
          </div>
        </div>
        <div class="sponsor-box">
          <div class="sponsor-about-box">
            <div class="sponsor-name">
              <a
                href="https://ethglobal.com/showcase/mint-tea-2nn7k"
                alt="ETH Global ETHOnline 2022"
                target="_blank"
                rel="noopener"
                >ETHOnline showcase</a
              >
            </div>
          </div>
          <div class="sponsor-image">
            <EthGlobal />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
/* Import SVG */
import EthGlobal from "../assets/svgs/EthGlobal.vue?component";
import ArrowDownBlack from "../assets/svgs/ArrowDownBlack.vue?component";
</script>
<style lang="scss" scoped>
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

section#about {
  width: 100%;
  color: $mint-black;
  display: flex;
  flex-direction: row wrap;
  align-content: center;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: linear-gradient(
    91deg,
    #fbe2ff 45.95%,
    rgba(251, 226, 255, 0) 99.2%
  );
  overflow: hidden;

  @include breakpoint($break-sm) {
    flex-direction: column;
  }
  @include breakpoint($break-xs) {
    flex-direction: column;
  }
  .about-left {
    width: 43%;
    flex-grow: 1 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5em 0 5em 8em;

    @include breakpoint($break-lg) {
      padding: 3em 0 3em 3em;
    }
    @include breakpoint($break-md) {
      padding: 3em 0 3em 2em;
    }
    @include breakpoint($break-sm) {
      width: 100%;
      padding: 1em 0 0 1.5em;
    }
    @include breakpoint($break-xs) {
      width: 100%;
      padding: 1em 0 0 1em;
    }

    .row-header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-content: flex-start;
      justify-content: center;
      align-items: center;
      margin: 25px 0;
      @include breakpoint($break-lg) {
        width: 100%;
        margin: 0 auto;
      }
      @include breakpoint($break-md) {
        width: 100%;
        margin: 0 auto;
      }
      @include breakpoint($break-sm) {
        width: 100%;
        margin: 0 auto;
      }
      @include breakpoint($break-xs) {
        width: 100%;
        margin: 0 auto;
      }
      h2 {
        width: 100%;
        color: $mint-black;
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 42px;
        text-align: left;
        margin: 0 0 20px 0;
        font-style: normal;
        .arrow-down {
          margin: 10px 0 -10px 10px;
        }
      }
      .mint-blue {
        color: $mint-blue;
      }
    }
    .about-box {
      width: 100%;
      color: $mint-black;
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: flex-start;
      justify-content: center;
      padding: 0;

      .team-box {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: flex-start;
        justify-content: center;
        margin-bottom: 20px;
        .team-image {
          background: $mint-blue;
          width: 145px;
          height: 120px;
          border-radius: 50%;
          border: 1px solid $white;
          display: flex;
          flex-direction: row;
          align-content: center;
          align-items: center;
          justify-content: center;
          img,
          svg {
            width: 90%;
            height: 90%;
            border-radius: 50%;
            object-fit: cover;
            overflow: hidden;
          }
        }
        .team-about-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-content: center;
          align-items: flex-start;
          justify-content: center;
          .team-name {
            font-size: 20px;
            font-style: normal;
            font-weight: 900;
            line-height: 24px;
            margin: 30px 0 0 22px;
          }
          .team-job {
            font-size: 18px;
            font-style: normal;
            font-weight: 300;
            line-height: 24px;
            margin: 0 0 0 22px;
          }
        }
      }
    }
  }
  .about-right {
    width: 100%;
    height: 100%;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @include breakpoint($break-md) {
      border-top-left-radius: 30px;
      padding: 2em 0 0 0;
      overflow: hidden;
    }
    @include breakpoint($break-sm) {
      width: 100%;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      padding: 1em;
    }
    @include breakpoint($break-xs) {
      width: 100%;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      padding: 1em 10px;
    }
    .sponsors-box {
      position: absolute;
      bottom: 6.5em;
      right: 33%;
      @include breakpoint($break-lg) {
        position: absolute;
        bottom: 5em;
        right: 20%;
      }
      @include breakpoint($break-md) {
        position: absolute;
        bottom: 5em;
        right: 6em;
      }
      @include breakpoint($break-sm) {
        position: relative;
        top: 0;
        right: 20px;
      }
      @include breakpoint($break-xs) {
        position: relative;
        top: 0;
        right: 20px;
      }
      .sponsor-box {
        width: 100%;
        color: $mint-black;
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 20px;

        .sponsor-about-box {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-content: center;
          align-items: center;
          justify-content: flex-end;
          .sponsor-name {
            margin: 0 35px 10px 0;
            a {
              font-size: 16px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
              color: $mint-black;
              transition: 0.4s;
              cursor: pointer;
            }
            a:hover {
              font-weight: bold;
            }
            a:active {
              font-weight: bold;
            }
          }
        }
        .sponsor-image {
          display: inline-block;
          width: 90px;
          height: 90px;
          img,
          svg {
            width: 90px;
            height: 90px;
            object-fit: cover;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
