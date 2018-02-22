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
  protected $numbersToTake = 0;

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
    $this->numbersToTake = $r->lastrow + 999;
    $this->GetProgramePerformance = DB::select('EXEC GetProgramePerformance ?, ?, ?, ?, ?, ?, ?',array($r->ChannelGroupID,$r->ChannelID,$r->PlatFormID,$r->PeriodTypeID,$r->Period,$r->Filter,$r->InputSortID))->skip($r->lastrow)->take($this->numbersToTake)->get();
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
    $this->GetProgramePerformance = DB::select('EXEC GetProgramePerformance ?, ?, ?, ?, ?, ?, ?',array($r->ChannelGroupID,$r->ChannelID,$r->PlatFormID,$r->PeriodTypeID,$r->Period,$r->Filter,$r->InputSortID));
    return response($this->GetProgramePerformance);
  }
  public function exporttrending(Request $r){
    $currentdatetime = date('Ymdhis');
    $this->GetTrending = DB::select('EXEC GetTrending ?, ?, ?, ?, ?, ?, ?',array($r->ProgTitleID,$r->ChannelGroupID,$r->ChannelID,$r->PeriodTypeID,$r->Period,$r->PlatFormID,$r->Filter));
    return response($this->GetTrending);
  }
  public function export_items_to_excel(Request $r){
    $output .= "<tr>
      <td style='text-align:center;'>1</td>
      <td style='text-align:center;'>2</td>
      <td style='text-align:center;'>3</td>
      <td style='text-align:center;'>4</td>
      <td style='text-align:center;'>5</td>
      <td style='text-align:center;'>6</td>
      <td style='text-align:center;'>7</td>
      <td style='text-align:center;'>8</td>
      <td style='text-align:center;width:220px !important;height:220px !important;'><img src='".$r->image."assets/uploads/".$item->item_picture."' style='width:200px !important;height:152px !important;'> </td>
    </tr>";
    header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    header("Content-Disposition: attachment; filename=items.xls");
    header("Cache-Control: max-age=0");
    echo $output;
  }    
}
