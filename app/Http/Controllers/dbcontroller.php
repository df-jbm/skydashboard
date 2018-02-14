<?php

namespace App\Http\Controllers;
use DB;
use Illuminate\Http\Request;

class dbcontroller extends Controller
{
  protected $GetChannelGroups = array();
  protected $GetPeriodRanges = array();
  protected $GetChannelPerformance = array();
  protected $GetProgramePerformance = array();
  protected $GetTrending = array();
  protected $ProgrammeTitles = array();

  public function __construct(){
    $this->GetChannelGroups = DB::select('EXEC GetChannelGroups');
    $this->GetPeriodRanges = DB::select('EXEC GetPeriodRanges');
  }

  public function GetChannelGroups(){
    return response($this->GetChannelGroups);
  }

  public function GetPeriodRanges(){
    return response($this->GetPeriodRanges);
  }

  public function GetChannelPerformance(Request $r){
    $this->GetChannelPerformance = DB::select('EXEC GetChannelPerformance ?, ?, ?, ?',array($r->ChannelGroupID,$r->PeriodTypeID,$r->Period,$r->Filter));
    return response($this->GetChannelPerformance);
  }

  public function GetProgramePerformance(Request $r){
    $this->GetProgramePerformance = DB::select('EXEC GetProgramePerformance ?, ?, ?, ?, ?, ?',array($r->ChannelGroupID,$r->ChannelID,$r->PlatFormID,$r->PeriodTypeID,$r->Period,$r->Filter));
    return response($this->GetProgramePerformance);
  }

  public function GetTrending(Request $r){
    $this->GetTrending = DB::select('EXEC GetTrending ?, ?, ?, ?, ?, ?, ?',array($r->ProgTitleID,$r->ChannelGroupID,$r->ChannelID,$r->PeriodTypeID,$r->Period,$r->PlatFormID,$r->Filter));
    return response($this->GetTrending);
  }

  public function BMITitles(Request $r){
    $this->ProgrammeTitles = DB::select('EXEC QueryBMIProgramTitles ?',array($r->InputFilter));
    return response($this->ProgrammeTitles);
  }
  public function ExpotChannelPerformance(Request $r){    
    $this->GetChannelPerformance = DB::select('EXEC GetChannelPerformance ?, ?, ?, ?',array($r->ChannelGroupID,$r->PeriodTypeID,$r->Period,$r->Filter));    
    return response($this->GetChannelPerformance);
  }

  public function exportprogramme(Request $r){
    $currentdatetime = date('Ymdhis');
    $this->GetProgramePerformance = DB::select('EXEC GetProgramePerformance ?, ?, ?, ?, ?, ?',array($r->ChannelGroupID,$r->ChannelID,$r->PlatFormID,$r->PeriodTypeID,$r->Period,$r->Filter));
    $file = fopen('csv/programmeperfomance'. $currentdatetime .'.xlsx', 'w+');
    fputcsv($file, ["BMI code","Programme title","Count","Sum000"]);
    foreach ($this->GetProgramePerformance as $row) {
      fputcsv($file, [$row->BMICode,$row->ProgrammeTitle,$row->CNT,$row->Sum000]);
    }
    fclose($file);
    return response('csv/programmeperfomance'. $currentdatetime .'.xlsx');
  }
  public function exporttrending(Request $r){
    $currentdatetime = date('Ymdhis');
    $this->GetTrending = DB::select('EXEC GetTrending ?, ?, ?, ?, ?, ?, ?',array($r->ProgTitleID,$r->ChannelGroupID,$r->ChannelID,$r->PeriodTypeID,$r->Period,$r->PlatFormID,$r->Filter));
    $file = fopen('csv/trending'. $currentdatetime .'.xlsx', 'w+');
    fputcsv($file, ["Prog date","Sum000"]);
    foreach ($this->GetTrending as $row) {
      fputcsv($file, [$row->ProgDate,$row->Sum000]);
    }
    fclose($file);
    return response('csv/trending'. $currentdatetime .'.xlsx');
  }    
}
