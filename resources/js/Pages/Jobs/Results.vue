<template>
    <app-layout title="Results">

        <div class="flex flex-col dark:text-black">
            <div class="py-4 flex flex-row">
                <div class="w-1/4 px-4 h-1/2">
                    <div class="bg-white shadow-xl sm:rounded-lg h-full dark:bg-slate-800 dark:text-white">
                        <div class="pb-2 pl-2 pt-2 h-full">
                            2D Waveform Spectrogram
                            <div class="flex-row pr-2 pt-2 mb-8" style="max-width: 15ch;">
                                <input
                                type="file"
                                class="form-control"
                                id="file-input"
                                accept="audio/*"
                                v-on:change="onFileChange($event)"
                                single
                                />
                            </div>
                            <jet-label class="text-white-500">File Path</jet-label><br>
                            <form>
                                <input type="text" id="fname" name="fname" v-model="spFile" v-on:submit="onFileChange($event)" style="color:black;">
                                <JetButton
                                    class="btn btn-success border-gray-200 m-2"
                                    @click="setSpFilePath()"
                                    v-if="singleFile == true">
                                    Submit
                                </JetButton>
                            </form>
                            <div class="loading pt-2" id="loading" ref="loading">
                                <div id="wave" class="p-2"/>
                                <vue-element-loading ref="animation" :active="loading" background-color="dark:rgba(0,0,0,.9);" spinner="bar-fade-scale" size="100" v-if="loading === true"
                                v-bind:display="none"/>
                                <input id="slider" ref="slider" type="range" min="1" max="200" value="1" style="width: 100%" @input="slideView"/>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="flex flex-col grow pr-4">
                    <div
                        class="p-4 flex bg-white shadow-xl sm:rounded-lg flex grow justify-between self-center max-h-24 w-full dark:bg-slate-800 dark:text-white"
                    >
                        <div class="pr-2 float-left self-end">
                            <JetButton
                                class="btn btn-success border-gray-200"
                                @click="switchMode()"
                                v-if="evaluateSingleFile()"
                                >Single File Analysis</JetButton
                            >
                            <JetButton
                                class="btn btn-success border-gray-200"
                                @click="switchModeSeries()"
                                v-if="evaluateMultiFile()"
                                >Multi File Analysis</JetButton
                            >
                            <jet-button
                                class="btn btn-success border-gray-200"
                                @click="switchModeMultiSeries()"
                                v-if="evaluateSingleSeries()"
                                >Single Series Analysis</jet-button
                            >
                            <jet-button
                                class="btn btn-success border-gray-200"
                                @click="switchModeBackToSingle()"
                                v-if="evaluateMultiSeries()"
                                >Multi Series Analysis</jet-button
                            >
                        </div>

                        <div class="flex-row px-4" v-if="!seriesComparison">
                            Site:
                            <select
                                class="flex grow dark:text-black"
                                id="selectFile"
                                v-model="selectedSite"
                                v-on:change="populateSeriesDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in siteSelectionList">
                                    {{ind}}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row px-4" v-if="!seriesComparison">
                            Series:
                            <select
                                class="flex grow dark:text-black"
                                id="selectFile"
                                v-model="selectedSeries"
                                v-on:change="populateSingleFileDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in seriesSelectionList">
                                    {{ind}}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row px-4" v-if="seriesComparison">
                            Site:
                            <select
                                class="flex grow dark:text-black"
                                id="selectFile"
                                v-model="selectedSite"
                                v-on:change="populateSeriesDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in siteSelectionList">
                                    {{ind}}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row px-4" v-if="seriesComparison">
                            Series:
                            <select
                                class="flex grow dark:text-black"
                                id="selectFile"
                                v-model="selectedSeries"
                                v-on:change="populateSingleFileDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in seriesSelectionList">
                                    {{ind}}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row px-4" v-if="multiSeries">
                            Site 2:
                            <select
                                class="flex grow dark:text-black"
                                id="selectFile"
                                v-model="selectedSiteComparison"
                                v-on:change="populateSecondSeriesDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in siteSelectionList">
                                    {{ind}}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row px-4" v-if="multiSeries">
                            Series 2:
                            <select
                                class="flex grow dark:text-black"
                                id="selectFile"
                                v-model="selectedSeriesComparison"
                                v-on:change="populateSecondSeriesDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in secondSeriesSelectionList">
                                    {{ind}}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4" v-if="!seriesComparison">
                            Select File:
                            <select
                                class="flex grow dark:text-black"
                                id="File"
                                v-model="sFile"
                                v-on:change="populateIndicesDropdown()"
                            >
                                <option v-bind:value="ind" v-for="ind in singleFileSelectionList">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4" v-if="evaluateMultiFile()">
                            Select File:
                            <select
                                class="flex grow dark:text-black"
                                id="compareFile"
                                v-model="cFile"
                                v-on:change="populateComparisonFileData()"
                            >
                                <option v-bind:value="ind" v-for="ind in singleFileSelectionList">
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4">
                            Indices:
                            <select
                                :disabled="(sFile == '' || sFile == null) || ((cFile == '' || cFile == null) && !singleFile)"
                                class="flex grow dark:text-black"
                                id="selectSeries"
                                v-model="currentIndex"
                                v-on:change="showGraphs()"
                            >
                                <option
                                    v-bind:value="ind"
                                    v-for="ind in indices"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4">
                            Select Chart:
                            <select
                                :disabled="upGraphs == 'NDSI' || upGraphs == 'RMS' || (sFile == '' || sFile == null) || ((cFile == '' || cFile == null) && !singleFile)"
                                class="flex grow dark:text-black"
                                id="chartSelect"
                                v-model="selectedChart"
                            >
                                <option
                                    v-bind:value="ind"
                                    v-for="ind in chartSelection"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>
                        <div class="absolute margin: auto; inset-x-0 bottom-10 text-slate-800" style="text-align: center; position: fixed; bottom: 0; z-index: 99 !important; display: none;">
                            <audio controls volume="0.1" ref="player" id="player" class="player" style="width: 40%; display: inline-block;" @play="play" @pause="pause" @seeked="updateSpectrogramTime" v-bind:currentTime="currTime">
                                <source v-bind:src="spFile"> Audio playback is not supported.
                            </audio>
                        </div>
                    </div>

                    <div
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                        v-if="upGraphs != '' && (selectedChart != '' || (selectedChart == '' && (upGraphs == 'NDSI' || upGraphs == 'RMS'))) && singleFile == true"
                    >

                        <div v-if="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-if="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <SingleBar :id="sFile+'CB'+'NDSI'" :xBarLabels="['Biophony', 'Anthrophony']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.biophonyL], [graphInput.anthrophonyL]]" :xLabel="'Biological VS Human Generated Sound'" :yLabel="'Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'AEI'" :xBarLabels="graphInput.bandRangeL" :dataSetLabels="['L Band Values']" :dataSetData="[graphInput.bandL]" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'" :xBarLabels="graphInput.bandRangeL" :dataSetLabels="['L Band Values', 'R Band Values']" :dataSetData="[graphInput.bandL, graphInput.bandR]" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'AEI'" :xBarLabels="['L Band Aei']" :dataSetLabels="[]" :dataSetData="[graphInput.aeiL]" :xLabel="'Frequency Band'" :yLabel="'Aei Index Computed Value'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'" :xBarLabels="['L Band Aei', 'R Band Aei']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.aeiL], [graphInput.aeiR]]" :xLabel="'Frequency Band'" :yLabel="'Aei Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'ADI'" :xBarLabels="graphInput.bandRangeL" :dataSetLabels="['L Band Values']" :dataSetData="[graphInput.bandL]" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'" :xBarLabels="graphInput.bandRangeL" :dataSetLabels="['L Band Values', 'R Band Values']" :dataSetData="[graphInput.bandL, graphInput.bandR]" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ADI'" :xBarLabels="['L Band Adi']" :dataSetLabels="[]" :dataSetData="[graphInput.adiL]" :xLabel="'Frequency Band'" :yLabel="'Adi Index Computed Value'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'" :xBarLabels="['L Band Adi', 'R Band Adi']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.adiL], [graphInput.adiR]]" :xLabel="'Frequency Band'" :yLabel="'Adi Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'BI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-if="selectedChart == 'Single Line'" :id="sFile+'SL'+'BIO'" :xBarLabels="graphInput.freqVals" :dataSetLabels="['L Band Values']" :dataSetData="[graphInput.valsL]" :xLabel="'Frequency'" :yLabel="'Bio Index Value'"/>
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'" :xBarLabels="graphInput.freqVals" :dataSetLabels="['L Band Values', 'R Band Values']" :dataSetData="[graphInput.valsL, graphInput.valsR]" :xLabel="'Frequency Range'" :yLabel="'Bio Index Value'"/>
                            <SingleBar v-if="selectedChart == 'Single Bar'" :id="sFile+'SB'+'BIO'" :xBarLabels="['L Band Bio']" :dataSetLabels="[]" :dataSetData="[graphInput.areaL]" :xLabel="'Frequency Band'" :yLabel="'Bio Index Computed Value'"/>
                            <SingleBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'" :xBarLabels="['L Band Bio', 'R Band Bio']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.areaL], [graphInput.areaR]]" :xLabel="'Frequency Band'" :yLabel="'Bio Computed Value'"/>
                            <SingleLine v-if="selectedChart == 'Frequency Over Time'" :id="sFile+'SLOT'+'BIO'" :xBarLabels="graphInput.range" :dataSetLabels="['Frequency']" :dataSetData="[graphInput.freqVals]" :xLabel="'Time (Minutes)'" :yLabel="'Frequency (Hz)'"/>
                        </div>

                        <div v-if="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <SingleBar :id="sFile+'CB'+'RMS'" :xBarLabels="['Band L RMS', 'Band R RMS']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.rmsL], [graphInput.rmsR]]" :xLabel="'Root Mean Square L Band and R Band'" :yLabel="'Root Mean Square'"/>
                        </div>
                    </div>
                    <div
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                        v-if="upGraphs != '' && (selectedChart != '' || (selectedChart == '' && (upGraphs == 'NDSI' || upGraphs == 'RMS'))) && singleFile == false && cFile != null && cFile != ''"
                    >
                    <div v-if="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'+cFile" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'+cFile" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-if="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <CompareBar :id="sFile+'CB'+'NDSI'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['Biophony', 'Anthrophony']" :dataSetData="[[graphInput.biophonyL, graphInputC.biophonyL], [graphInput.anthrophonyL, graphInputC.anthrophonyL]]" :xLabel="'Biological VS Human Generated Sound'" :yLabel="'Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'+cFile" :xBarLabels="graphInput.bandRangeL" :dataSetLabels="[sFile, cFile]" :dataSetData="[graphInput.bandL, graphInputC.bandL]" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Aei', 'R Band Aei']" :dataSetData="[[graphInput.aeiL, graphInputC.aeiL], [graphInput.aeiR, graphInputC.aeiR]]" :xLabel="'Frequency Band'" :yLabel="'Aei Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'+cFile" :xBarLabels="graphInput.bandRangeL" :dataSetLabels="[sFile, cFile]" :dataSetData="[graphInput.bandL, graphInputC.bandL]" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Adi', 'R Band Adi']" :dataSetData="[[graphInput.adiL, graphInputC.adiL], [graphInputC.adiR, graphInputC.adiR]]" :xLabel="'Frequency Band'" :yLabel="'Adi Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'BI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-if="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'+cFile" :xBarLabels="graphInput.freqVals" :dataSetLabels="[sFile, cFile]" :dataSetData="[graphInput.valsL, graphInputC.valsL]" :xLabel="'Frequency Range'" :yLabel="'Bio Index Value'"/>
                            <CompareBar v-if="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Bio', 'R Band Bio']" :dataSetData="[[graphInput.areaL, graphInputC.areaL], [graphInput.areaR, graphInputC.areaR]]" :xLabel="'Frequency Band'" :yLabel="'Bio Computed Value'"/>
                        </div>

                        <div v-if="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <CompareBar :id="sFile+'CB'+'RMS'" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Rms', 'R Band Rms']" :dataSetData="[[graphInput.rmsL, graphInputC.rmsL], [graphInput.rmsR, graphInputC.rmsR]]" :xLabel="'Root Mean Square L Band and R Band'" :yLabel="'Root Mean Square'"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import SpectrogramPlugin from "wavesurfer.js/src/plugin/spectrogram";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
import VueElementLoading from "vue-element-loading";
import JetButton from "@/Jetstream/Button.vue";
import VisualizationsDemo from "@/Pages/ChartVisualizations/VisualizationsDemo.vue";
import CompareBar from '@/Pages/ChartVisualizations/CompareBar.vue';
import DualLine from '@/Pages/ChartVisualizations/DualLine.vue';
import SingleBar from '@/Pages/ChartVisualizations/SingleBar.vue';
import SingleLine from '@/Pages/ChartVisualizations/SingleLine.vue';
import * as Papa from 'papaparse';
import { usePage } from '@inertiajs/inertia-vue3'

let currentIndex = "";
let compareIndex = "";
let upGraphs = "";
let selectedChart = "";
let graphInput, graphInputC;

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        WaveSurfer,
        VisualizationsDemo,
        CompareBar,
        DualLine,
        SingleBar,
        SingleLine,
        VueElementLoading
    },

    data() {
        return {
            spFile: "",
            sFile: "",
            cFile: "",
            startDate: "",
            endDate: "",
            selectRecordings: [],
            singleFile: true,
            indices: ["ACI", "NDSI", "AEI", "ADI", "BI", "RMS"],
            chartSelection: ["Single Line", "Single Bar", "Dual Line", "Compare Bar"],
            selectedChart,
            currentIndex,
            compareIndex,
            upGraphs,
            graphInput,
            graphInputC,
            items: [],
            siteSelectionList: [],
            currTime: 0.0,
            loading: true,
            sites: [],
            seriesSelectionList: [],
            site: {},
            selectedSite: '',
            singleFileSelectionList: [],
            selectedSeries: '',
            series: {},
            firstFileData: {},
            secondFileData: {},
            seriesComparison: false,
            multiSeries: false,
            secondSeriesSelectionList: [],
            selectedSiteComparison: '',
            secondSite: {}
        };
    },
    watch: {
        sFile: function (file) {
            this.loading = true;
            this.spFile = URL.createObjectURL(file);
            this.$refs.player.load();
            this.createSpectrogram();
        }
    },
    methods: {

        setSpFilePath: function() {
            this.loading = true;
            this.$refs.player.load();
            this.createSpectrogram();
        },

        onFileChange: function (e) {
            this.loading = true;
            this.spFile = URL.createObjectURL(e.target.files[0]);
            this.$refs.player.load();
            this.createSpectrogram();
        },

        createSpectrogram() {
            this.wavesurfer.load(this.spFile);
        },

        play: function () {
            this.wavesurfer.play();
        },
        pause: function () {
            this.wavesurfer.pause();
        },
        showGraphs: function () {
            this.upGraphs = this.currentIndex
            console.log(this.currentIndex)
            this.graphInput = JSON.parse(this.firstFileData[`${this.currentIndex.toLowerCase() + '_results'}`])

            if (this.singleFile == false) {
                this.graphInputC = JSON.parse(this.secondFileData[`${this.currentIndex.toLowerCase() + '_results'}`])
                this.chartSelection = ["Dual Line", "Compare Bar"]

                if (this.selectedChart)
                {
                    this.selectedChart = 'Dual Line'
                }
            } else {
                if (this.selectedChart)
                {
                    this.selectedChart = 'Single Line'
                }

                if (this.upGraphs == 'BI') {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar", "Frequency Over Time"]

                    let end = this.graphInput.freqVals.length;
                    let range = Array(end - 0 + 1).fill().map((_, idx) => 0 + idx);
                    this.graphInput = {...this.graphInput, range: range}
                } else {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar"]
                }
            }
        },
        switchMode: function () {
            this.singleFile = !this.singleFile
            this.selectedChart = ''
        },
        switchModeSeries: function () {
            this.seriesComparison = true
        },
        switchModeMultiSeries: function () {
            this.multiSeries = true
        },
        switchModeBackToSingle: function () {
            this.singleFile = true
            this.seriesComparison = false
            this.multiSeries = false
        },
        evaluateSingleFile: function () {
            if (this.singleFile)
                return true
            return false
        },
        evaluateMultiFile: function () {
            if (!this.singleFile && !this.seriesComparison)
                return true
            return false
        },
        evaluateSingleSeries: function () {
            if (!this.singleFile && this.seriesComparison && !this.multiSeries)
                return true
            return false
        },
        evaluateMultiSeries: function () {
            if (!this.singleFile && !this.singleSeries && this.multiSeries)
                return true
            return false
        },
        populateDropdown: function (items) {
            let selectionList = []
            Object.keys(items).forEach(x => {
                if (items != null && items[x] != null && x.includes("input")) {
                    Object.keys(JSON.parse(items[x].results)).forEach(y => {
                        if (selectionList != null && !selectionList.includes(y)) {
                            selectionList.push(y)
                        }
                    })
                }
            })
            this.selectionList = selectionList
        },

        populateSiteDropdown: function () {
            let siteList = []
            this.sites.forEach(x => {
                siteList.push(x.name)
            })
            this.siteSelectionList = siteList;
        },

        populateSeriesDropdown: function () {
            let seriesList = []
            this.site = this.sites.find(x => x.name == this.selectedSite)

            this.site.series.forEach(x => seriesList.push(x.name))
            this.seriesSelectionList = seriesList;
        },
        populateSecondSeriesDropdown: function () {
            let seriesList = []
            this.secondSite = this.sites.find(x => x.name == this.selectedSiteComparison)

            this.secondSite.series.forEach(x => seriesList.push(x.name))
            this.secondSeriesSelectionList = seriesList;
        },
        populateSingleFileDropdown: function () {
            let fileList = []
            this.series = this.site.series.find(x => x.name == this.selectedSeries)
            this.series.results.forEach(x => fileList.push(x.file.name))
            this.singleFileSelectionList = fileList
        },
        populateComparisonFileData: function () {
            this.secondFileData = {}
            this.series.results.forEach(x => {
                if (x.file.name == this.sFile)
                    this.secondFileData = x
            })

            this.graphInputC = JSON.parse(this.secondFileData[`${this.currentIndex.toLowerCase() + '_results'}`])

            if (this.currentIndex != null && this.currentIndex != '') {
                if (this.singleFile == false) {
                this.chartSelection = ["Dual Line", "Compare Bar"]

                if (this.selectedChart)
                {
                    this.selectedChart = 'Dual Line'
                }
            } else {
                if (this.selectedChart)
                {
                    this.selectedChart = 'Single Line'
                }

                if (this.upGraphs == 'BI') {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar", "Frequency Over Time"]
                } else {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar"]
                }
            }
            }
        },
        populateIndicesDropdown: function () {
            const findIndicesUsed = (object) => {
                let indicesUsed = []
                Object.keys(object).map(key => {
                    if (key.includes('aci') && object[key] != null && !indicesUsed.includes('ACI')) {
                        indicesUsed.push('ACI')
                    }
                    if (key.includes('adi') && object[key] != null && !indicesUsed.includes('ADI')) {
                        indicesUsed.push('ADI')
                    }
                    if (key.includes('aei') && object[key] != null && !indicesUsed.includes('AEI')) {
                        indicesUsed.push('AEI')
                    }
                    if (key.includes('bi') && object[key] != null && !indicesUsed.includes('BI')) {
                        indicesUsed.push('BI')
                    }
                    if (key.includes('ndsi') && object[key] != null && !indicesUsed.includes('NDSI')) {
                        indicesUsed.push('NDSI')
                    }
                    if (key.includes('rms') && object[key] != null && !indicesUsed.includes('RMS')) {
                        indicesUsed.push('RMS')
                    }
                })
                return indicesUsed
            };

            this.firstFileData = {}
            this.series.results.forEach(x => {
                if (x.file.name == this.sFile)
                    this.firstFileData = x
            })

            this.indices = findIndicesUsed(this.firstFileData)

        },

        updateSpectrogramTime: function() {
            this.currTime = this.$refs['player'].currentTime;
            var timeDelta = Math.abs(this.currTime - this.wavesurfer.getCurrentTime());
            if (timeDelta > 0.1) {
                this.wavesurfer.seekTo(this.currTime / this.wavesurfer.getDuration());
            }
        },

        slideView: function() {
            this.wavesurfer.zoom(Number(this.$refs.slider.value));
        },
    },
    mounted() {
        const self = this;

        this.wavesurfer = WaveSurfer.create({

            //overflow:hidden,
            height: 200,
            width: 600,
            container: "#wave",
            waveColor: "#D2EDD4",
            progressColor: "#46B54D",
            backend: "MediaElement",
            mediaControls: true,

            plugins: [
                SpectrogramPlugin.create({
                    height:600,
                    width:600,
                    container: "#wave",
                    labels: true,
                    colorMap: this.colorMap,
                }),
                RegionsPlugin.create({
                    regions: [
                        {
                            start: 1,
                            end: 3,
                            loop: false,
                            color: 'hsla(400, 100%, 30%, 0.5)'
                        },
                    ],
                    dragSelection: {
                        slop: 5
                    }
                })
            ],
        });
        this.wavesurfer.on('ready', function() {
            self.$refs['animation'].display = "inline";
        });
        this.wavesurfer.on('waveform-ready', function() {
            //self.$refs['animation'].active = false;
            self.$refs['animation'].display = "none";
            self.$refs['animation'].show = false;
            self.loading = false;
        });
        this.wavesurfer.on('seek', function() {
            self.currTime = self.wavesurfer.getCurrentTime();
            var timeDelta = Math.abs(self.currTime - self.wavesurfer.getCurrentTime());
            if (timeDelta > 0.1) {
                self.wavesurfer.seekTo(self.currTime / self.wavesurfer.getDuration());
            }
        });

        this.sites = usePage().props.value.sites
        this.populateSiteDropdown()
    },
});
</script>
