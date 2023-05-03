package entity

import (
	"testing"
	"time"
	. "github.com/onsi/gomega"
	"github.com/asaskevich/govalidator"
)

func TestNewdayIDReportProblem(t *testing.T) {
	g := NewGomegaWithT(t)
    t.Run("check newIDdata is validate", func(t *testing.T){
		reportProblem := &ReportProblem{
        ID:               10,
        NotificationDate: time.Now(),
        Heading:          "Test Heading",
        Description:      "Test Description",
	}

    ok, err := govalidator.ValidateStruct(reportProblem)
    // Get today's date
    today := time.Now().Truncate(24 * time.Hour)
    // Check that the error is nil
    g.Expect(ok, err)
    // Check that the reportProblem ID has been updated
    g.Expect(t, int(today.Unix()), reportProblem.ID)
    // Check that the NotificationDate is set to today's date
    g.Expect(t, today.Format("2006-01-02"), reportProblem.NotificationDate.Format("2006-01-02"))
})
}